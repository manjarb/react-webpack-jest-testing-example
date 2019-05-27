import React from 'react';
import { fireEvent, wait } from 'react-testing-library';
import mockAxios from 'axios';

import PortalsManagementTab from './portals-management-tab';
import { reduxRender } from '../../testing/utils';
import { compareResult, xmlList } from '../../testing/mockData';

jest.mock('axios');

describe('<PortalsManagementTab />', () => {
  let testId;
  let testText;
  let testRerender;
  let testDebug;
  const setCurrentTab = jest.fn();

  beforeAll(() => {
    window.alert = () => {};
  })

  beforeEach(() => {
    mockAxios.mockResolvedValue({ data: xmlList });

    const {
      getByTestId, getByText, rerender, debug,
    } = reduxRender(
      <PortalsManagementTab setCurrentTab={setCurrentTab} />,
    );
    testId = getByTestId;
    testText = getByText;
    testRerender = rerender;
    testDebug = debug;
  });

  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.mockClear();
  });

  test('display <PortalUploadForm /> correctly', () => {
    expect(testId('portal-upload-form-container')).toBeInTheDocument();
  });

  test('display <PortalRemoteXmlDownload /> correctly', () => {
    expect(testId('portal-remote-xml-download-container')).toBeInTheDocument();
  });

  test('display <TablePortalXmlListMerged /> Correctly', () => {
    expect(testId('table-portal-xml-list-merged-container')).toBeInTheDocument();
  });

  test('display Start Compare button correctly', () => {
    expect(testText('Start Compare')).toBeInTheDocument();
  });

  test('Start Compare Button works correctly', async () => {
    expect(mockAxios).toHaveBeenCalledTimes(1);
    // mockAxios.mockClear();
    await wait(() => {
      // mockAxios.mockClear();
      mockAxios.mockResolvedValue({ data: { ...compareResult } });
      fireEvent.click(testText('Start Compare'));
    });

    await wait(() => {
      expect(mockAxios).toHaveBeenCalledTimes(2);
      expect(setCurrentTab).toHaveBeenCalledTimes(1);
      expect(setCurrentTab).toHaveBeenCalledWith('comparing');
    });
  });

  test('Snapshot matched', () => {
    expect(testId('portals-management-tab-container')).toMatchSnapshot();
  });
});
