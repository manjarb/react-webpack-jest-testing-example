import React from 'react';
import { fireEvent } from 'react-testing-library';
import mockAxios from 'jest-mock-axios';

import { reduxRender } from '../../testing/utils';
import { portalObjectData, xmlList } from '../../testing/mockData';
import PagesCompare from './pages-compare';

describe('<PagesCompare>', () => {
  let testId;
  let testText;
  let testRerender;
  let testDebug;

  beforeAll(() => {

  });

  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });

  beforeEach(() => {
    const {
      getByTestId, getByText, rerender, debug,
    } = reduxRender(
      <PagesCompare
        originalPortalName="portal-small-testing01.xml"
        modifyPortalName="portal-small-testing03.xml"
      />,
    );
    testId = getByTestId;
    testText = getByText;
    testRerender = rerender;
    testDebug = debug;
  });

  test('display all Tabs correctly', () => {
    expect(testId('portals-configuration-link')).toBeInTheDocument();
    expect(testId('comparing-filtered-data-link')).toBeInTheDocument();
    expect(testId('original-portal-link')).toBeInTheDocument();
    expect(testId('modify-portal-link')).toBeInTheDocument();
    expect(testId('import-package-portal-link')).toBeInTheDocument();
  });

  test('display Tabs content correctly', () => {
    expect(testId('portals-management-tab-container')).toBeInTheDocument();

    fireEvent.click(testId('comparing-filtered-data-link'));
    expect(testId('comparing-portal-content')).toBeInTheDocument();

    fireEvent.click(testId('original-portal-link'));
    expect(testId('original-portal-content')).toBeInTheDocument();

    fireEvent.click(testId('modify-portal-link'));
    expect(testId('modify-portal-content')).toBeInTheDocument();

    fireEvent.click(testId('import-package-portal-link'));
    expect(testId('package-import-content')).toBeInTheDocument();

    fireEvent.click(testId('portals-configuration-link'));
    expect(testId('portal-management-content')).toBeInTheDocument();
  });

  test('Get Modify Portal button works correctly', () => {
    mockAxios.mockResponse({ data: { ...xmlList } });
    expect(mockAxios).toHaveBeenCalledTimes(1);
    fireEvent.click(testId('modify-portal-link'));
    mockAxios.reset();
    fireEvent.click(testText(/Get Modify Portal/i));
    mockAxios.mockResponse({ data: { ...portalObjectData } });
    expect(mockAxios).toHaveBeenCalledTimes(2);
    expect(testId('modify-page-content-box')).toBeInTheDocument();
  });
});
