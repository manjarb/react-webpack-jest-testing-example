import React from 'react';
import { render, fireEvent, wait } from 'react-testing-library';

import { reduxRender } from '../../../testing/utils';
import PortalUploadForm from './portal-upload-form';

describe('<PortalUploadForm />', () => {
  let testLabel;
  let testText;
  let testId;
  let testDebug;

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
});
