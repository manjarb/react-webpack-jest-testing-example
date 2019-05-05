import React from 'react'
import ReactDom from 'react-dom'
import Editor from '../editor.todo'

test('calls onSubmit with the username and password when submitted', () => {
  const container = document.createElement('div')
  ReactDom.render(<Editor/>, container)
  const form = container.querySelector('form')
  const {title, content, tags} = form.elements
  console.log(title, 'title 3peus4u eeiueeueeuuueeeueeee eueeeeeue3')
  console.log(content, 'content')
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
