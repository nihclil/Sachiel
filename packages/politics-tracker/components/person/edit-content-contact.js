import React, { Fragment, useState, useMemo } from 'react'
import { EditContentItemTitle } from './edit-content-item'
import { stringToSources, sourcesToString, getNewSource } from '~/utils/utils'
import SourceInput from '../politics/source-input'
import { InputWrapperNoLabel } from './edit-content-biography'
import AddInputButton from './add-input-button'
import EditSource from './edit-source'
import EditSendOrCancel from './edit-send-or-cancel'
import { print } from 'graphql'
import CreatePerson from '~/graphql/mutation/person/create-person.graphql'
import { fireGqlRequest } from '~/utils/utils'
import { useToast } from '~/components/toast/use-toast'
import styled from 'styled-components'
import { logGAEvent } from '~/utils/analytics'

const ErrorMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #c0374f;
  margin: 5px 0px;
`
/**
 *
 * @param {Object} props
 * @param {string} [props.emails]
 * @param {string} [props.links]
 * @param {string} [props.contactDetails]
 * @param {string} [props.sources]
 * @param {function} props.setShouldShowEditMode
 * @param {import('~/types/person').Person["id"]} props.personId
 * @param {import('~/types/person').Person["name"]} props.personName
 * @returns {React.ReactElement}
 */
export default function EditContentContact({
  emails,
  links,
  contactDetails,
  sources,
  setShouldShowEditMode,
  personId,
  personName,
}) {
  const toast = useToast()

  const [emailList, setEmailList] = useState(
    emails ? stringToSources(emails, '\n') : [getNewSource()]
  )
  const [linkList, setLinkList] = useState(
    links ? stringToSources(links, '\n') : [getNewSource()]
  )
  const [contactList, setContactList] = useState(
    contactDetails ? stringToSources(contactDetails, '\n') : [getNewSource()]
  )
  const [sourceList, setSourceList] = useState(
    sources ? stringToSources(sources, '\n') : [getNewSource()]
  )

  // create "totalList" to concat emailList/linkList/contactList
  // send totalList as a prop to edit-source.js to judge whether error message show
  const totalList = emailList.concat(linkList).concat(contactList)

  // check whether source-list value has ('')
  // if have (''), return true
  const SourceValueCheck = takeArrayKeyName(sourceList, 'value')?.some(
    // @ts-ignore
    (x) => x === ''
  )

  //if input's sum = 1 and value is empty, return false (button=able)
  //if input's sum > 1, true/false is decided by whether inputs have ('')
  // @ts-ignore
  const infoLinksCheckEmptyValue = (infoLinksArray) => {
    if (infoLinksArray.length === 1 && infoLinksArray[0].value === '') {
      return false
    } else {
      const result = takeArrayKeyName(infoLinksArray, 'value')?.some(
        // @ts-ignore
        (x) => x === ''
      )
      return result
    }
  }
  /**
   * If property `value` of element in `emailList`, linkList and contactList are all empty string,
   * or property `value` of element in `sourceList` are all empty string,
   * then should disable submit button.
   */

  const shouldDisableSubmit = useMemo(
    () =>
      (emailList.filter((i) => i.value).length === 0 &&
        linkList.filter((i) => i.value).length === 0 &&
        contactList.filter((i) => i.value).length === 0) ||
      (JSON.stringify(takeArrayKeyName(emailList, 'value')) ===
        JSON.stringify(
          // @ts-ignore
          takeArrayKeyName(stringToSources(emails, '\n'), 'value')
        ) &&
        JSON.stringify(takeArrayKeyName(contactList, 'value')) ===
          JSON.stringify(
            // @ts-ignore
            takeArrayKeyName(stringToSources(contactDetails, '\n'), 'value')
          ) &&
        JSON.stringify(takeArrayKeyName(linkList, 'value')) ===
          JSON.stringify(
            // @ts-ignore
            takeArrayKeyName(stringToSources(links, '\n'), 'value')
          ) &&
        JSON.stringify(takeArrayKeyName(sourceList, 'value')) ===
          JSON.stringify(
            // @ts-ignore
            takeArrayKeyName(stringToSources(sources, '\n'), 'value')
          )) ||
      sourceList.filter((i) => i.value).length === 0 ||
      emailList.filter((i) => !emailValidationCheck(i.value)).length !== 0 ||
      linkList.filter((i) => !URLValidationCheck(i.value)).length !== 0 ||
      SourceValueCheck ||
      infoLinksCheckEmptyValue(emailList) ||
      infoLinksCheckEmptyValue(linkList) ||
      infoLinksCheckEmptyValue(contactList),
    [emailList, linkList, contactList, sourceList]
  )

  // @ts-ignore
  function takeArrayKeyName(array, key) {
    // @ts-ignore
    return array?.map(function (item) {
      return item[key]
    })
  }
  //client side only
  //TODO: use type Person in person.ts rather than {Object}
  /** @param {Object} data */
  async function createPerson(data) {
    const cmsApiUrl = `${window.location.origin}/api/data`

    try {
      const variables = {
        data: {
          thread_parent: {
            connect: { id: personId },
          },
          ...data,
        },
      }
      const result = await fireGqlRequest(
        print(CreatePerson),
        variables,
        cmsApiUrl
      )
      console.log(result)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  async function submitHandler() {
    const isSuccess = await createPerson({
      name: personName,
      email: sourcesToString(emailList, '\n'),
      links: sourcesToString(linkList, '\n'),
      contact_details: sourcesToString(contactList, '\n'),
    })
    if (isSuccess) {
      toast.open({
        status: 'success',
        title: '送出成功',
        desc: '通過志工審核後，您新增的資料就會出現在這裡',
      })
      setShouldShowEditMode(false)
    } else {
      toast.open({
        status: 'fail',
        title: '出了點問題...',
        desc: '送出失敗，請重試一次',
      })
    }
  }

  /**
   *
   * @param  {import('~/types/common').Source[]} list
   * @param {function} setList
   * @returns {()=>void}
   */
  function addList(list, setList) {
    return () => {
      const extended = [...list, getNewSource()]
      setList(extended)
    }
  }
  /**
   * @param  {import('~/types/common').Source[]} list
   * @param {Function} setList
   * @returns {() => void}
   */
  function updateList(list, setList) {
    return (/** @type {string} */ id, /** @type {string} */ value) => {
      const updated = list.map((item) => {
        if (id === item.id) {
          return { ...item, value }
        }
        return item
      })
      setList(updated)
    }
  }

  /**
   * @param  {import('~/types/common').Source[]} list
   * @param {Function} setList
   * @returns {() => void}
   */
  function deleteList(list, setList) {
    return (/** @type {string} */ id) => {
      const remain = list.filter((item) => id !== item.id)
      setList(remain)
    }
  }

  /**
   * @param {string} email
   */

  // email-validation-check
  function emailValidationCheck(email) {
    const emailRules =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (email === '') {
      return true
    } else {
      return emailRules.test(email)
    }
  }

  /**
   * @param {string} url
   */
  // URL-validation-check
  function URLValidationCheck(url) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    )
    if (url === '') {
      return true
    } else {
      return pattern.test(url)
    }
  }

  const updateEmail = updateList(emailList, setEmailList)
  const addEmail = addList(emailList, setEmailList)
  const deleteEmail = deleteList(emailList, setEmailList)
  const updateLink = updateList(linkList, setLinkList)
  const addLink = addList(linkList, setLinkList)
  const deleteLink = deleteList(linkList, setLinkList)
  const updateContact = updateList(contactList, setContactList)
  const addContact = addList(contactList, setContactList)
  const deleteContact = deleteList(contactList, setContactList)

  return (
    <Fragment>
      <EditContentItemTitle>電子信箱</EditContentItemTitle>
      {emailList?.map((item, index) => (
        //TODO: add error and show error
        <InputWrapperNoLabel key={item.id}>
          <SourceInput
            placeholder={'信箱'}
            id={item.id}
            no={index + 1}
            value={item.value}
            error={item.error}
            showError={false}
            removable={index !== 0}
            onChange={updateEmail}
            onDelete={deleteEmail}
          />
          {!emailValidationCheck(item.value) && (
            <ErrorMessage>請輸入有效的Email</ErrorMessage>
          )}
        </InputWrapperNoLabel>
      ))}
      <AddInputButton addTarget="電子信箱" onClick={addEmail}></AddInputButton>

      <EditContentItemTitle>電話/地址</EditContentItemTitle>
      {contactList?.map((item, index) => (
        //TODO: add error and show error
        <InputWrapperNoLabel key={item.id}>
          <SourceInput
            placeholder={'電話/地址'}
            id={item.id}
            no={index + 1}
            value={item.value}
            error={item.error}
            showError={false}
            removable={index !== 0}
            onChange={updateContact}
            onDelete={deleteContact}
          />
        </InputWrapperNoLabel>
      ))}
      <AddInputButton
        addTarget="電話/地址"
        onClick={addContact}
      ></AddInputButton>
      <EditContentItemTitle>網站</EditContentItemTitle>

      {linkList?.map((item, index) => (
        //TODO: add error and show error
        <InputWrapperNoLabel key={item.id}>
          <SourceInput
            placeholder={'網站'}
            id={item.id}
            no={index + 1}
            value={item.value}
            error={item.error}
            showError={false}
            removable={index !== 0}
            onChange={updateLink}
            onDelete={deleteLink}
          />
          {!URLValidationCheck(item.value) && (
            <ErrorMessage>請輸入有效的網址</ErrorMessage>
          )}
        </InputWrapperNoLabel>
      ))}
      <AddInputButton addTarget="網站" onClick={addLink}></AddInputButton>
      <EditSource
        sourceList={sourceList}
        setSourceList={setSourceList}
        inputStatusCheck={totalList}
      />
      <EditSendOrCancel
        isDisable={shouldDisableSubmit}
        onClick={() => setShouldShowEditMode(false)}
        submitHandler={() => submitHandler()}
        GAClick={() => {
          logGAEvent('click', '點擊「聯絡方式」區塊的「送出審核」')
        }}
      />
    </Fragment>
  )
}
