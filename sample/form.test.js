import React from 'react';
import { render, fireEvent, wait } from 'react-testing-library';
// import mockAxios from 'jest-mock-axios';
import mockAxios from 'axios';
import { reduxRender } from '../../../testing/utils';
import { uploadPortalResult } from '../../../testing/mockData';
import PortalUploadForm from './portal-upload-form';

jest.mock('axios');

describe('<PortalUploadForm />', () => {
  let testLabel;
  let testText;
  let testId;
  let testDebug;

  beforeAll(() => {

  });

  beforeEach(() => {
    const {
      getByLabelText, getByText, getByTestId, debug,
    } = reduxRender(
      <PortalUploadForm />,
    );

    testLabel = getByLabelText;
    testText = getByText;
    testId = getByTestId;
    testDebug = debug;
  });

  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.mockReset();
  });

  test('renders a form with file, name, description, uploaded by and a submit button', async () => {
    expect(testId('portal-upload-form-container')).toHaveFormValues({
      fileUpload: '',
      fileName: '',
      description: '',
      uploadedBy: '',
    });
  });

  test('renders an error validation', async () => {
    const fileError = testId('portal-upload-file-error');
    const nameError = testId('portal-upload-name-error');
    const descriptionError = testId('portal-upload-description-error');
    const uploadByError = testId('portal-upload-by-error');
    expect(fileError).toBeEmpty();
    expect(nameError).toBeEmpty();
    expect(descriptionError).toBeEmpty();
    expect(uploadByError).toBeEmpty();
    const submitButton = testId('portal-upload-submit-button');
    fireEvent.click(submitButton);
    await wait(() => {
      expect(fileError).toHaveTextContent('Required');
      expect(nameError).toHaveTextContent('Required');
      expect(descriptionError).toHaveTextContent('Required');
      expect(uploadByError).toHaveTextContent('Required');
    });
  });

  test('Submit Data correctly', async () => {
    // Make sure to resolve with a promise
    mockAxios.mockResolvedValue({ data: uploadPortalResult });

    const fileInput = testLabel(/Portal\.zip or portalserver\.xml file file to Upload/i);
    const file = new File(['(⌐□_□)'], 'chucknorris.png', {
      type: 'image/png',
    });
    // i have to do this because `input.files =[file]` is not allowed
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    const nameInput = testLabel(/File name \(No extension needed\)/i);
    const descriptionInput = testLabel(/Description/i);
    const uploadByInput = testLabel(/Uploaded By/i);

    fireEvent.change(fileInput);
    fireEvent.change(nameInput, { target: { value: 'testName' } });
    fireEvent.change(descriptionInput, { target: { value: 'testDescription' } });
    fireEvent.change(uploadByInput, { target: { value: 'uploadByInput' } });

    const submitButton = testId('portal-upload-submit-button');
    fireEvent.click(submitButton);
    await wait(() => {
      expect(mockAxios).toHaveBeenCalledTimes(1);
      expect(fileInput.value).toEqual('');
      expect(nameInput.value).toEqual('');
      expect(descriptionInput.value).toEqual('');
      expect(uploadByInput.value).toEqual('');
    });
  });
});
