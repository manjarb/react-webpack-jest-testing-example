import React from 'react'
import ReactDom from 'react-dom'
import * as utilsMock from '../../utils/api'
import Editor from '../editor.todo'

jest.mock('../../utils/api', () => {
  return {
    posts: {
      create: jest.fn(() => Promise.resolve())
    }
  }
})

const flushPromises = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

test('calls onSubmit with the username and password when submitted', async () => {
  const container = document.createElement('div')
  const fakeUser = {id: 'foobar'}
  const fakeHistory = {
    push: jest.fn()
  };
  ReactDom.render(<Editor user={fakeUser} history={fakeHistory}/>, container)
  const form = container.querySelector('form')
  const {title, content, tags} = form.elements
  title.value = "I like manjarb"
  content.value = "Like a lot... Sorta"
  tags.value = 'twix, my,  likes235'

  const submit = new window.Event('submit')
  form.dispatchEvent(submit)

  await flushPromises()

  expect(fakeHistory.push).toHaveBeenCalledTimes(1)
  expect(fakeHistory.push).toHaveBeenCalledWith('/')
  expect(utilsMock.posts.create).toHaveBeenCalledTimes(1)
    expect(utilsMock.posts.create).toHaveBeenCalledWith({
        authorId: fakeUser.id,
        title: title.value,
        content: content.value,
        tags: ['twix', 'my', 'likes235'],
        date: expect.any(String)
    })
  // console.log(content, 'content')
  // Arrange
  // create a fake user, post, history, and api
  //
  // use ReactDOM.render() to render the editor to a div
  //
  // fill out form elements with your fake post
  //
  // Act
  // submit form
  //
  // wait for promise to settle
  //
  // Assert
  // ensure the create function was called with the right data
})

// TODO later...
test('snapshot', () => {})
