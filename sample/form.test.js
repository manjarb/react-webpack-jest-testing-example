import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { connect } from 'react-redux';

import { updateXmlList, updateGlobalLoading } from '../../../redux/actions/index';
import { sortArrayByKey } from '../../../helper/data-helper';

class PortalUploadForm extends Component {
    formSubmit = (values, actions) => {
      this.props.updateGlobalLoading(true);

      const formData = new FormData();
      formData.append('fileUpload', values.fileUpload);
      formData.append('fileName', values.fileName);
      formData.append('description', values.description);
      formData.append('uploadedBy', values.uploadedBy);

      axios({
        method: 'post',
        url: '/v1/upload/xml/portal',
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' } },
      }).then((res) => {
        console.log(res, '4444 ====================================================');
        this.props.updateXmlList(res.data.files.sort((a, b) => sortArrayByKey(b, a, 'created')));
        this.fileUploadInput.value = null;
        actions.resetForm({
          fileUpload: null,
          fileName: '',
          description: '',
          uploadedBy: '',
        });
        actions.setSubmitting(false);
        this.props.updateGlobalLoading(false);
      }).catch((error) => {
        console.error(error, '==========================================');
        actions.setSubmitting(false);
        this.props.updateGlobalLoading(false);
      });
    };

    formValidate = (values) => {
      const requiredText = 'Required';

      const errors = {};
      if (!values.fileUpload) {
        errors.fileUpload = requiredText;
      }

      if (!values.fileName) {
        errors.fileName = requiredText;
      }

      if (!values.description) {
        errors.description = requiredText;
      }

      if (!values.uploadedBy) {
        errors.uploadedBy = requiredText;
      }

      return errors;
    };

    returnDangerClass = status => (status ? 'is-danger' : '');

    render() {
      return (
        <Formik
          initialValues={{
            fileUpload: null,
            fileName: '',
            description: '',
            uploadedBy: '',
          }}
          validate={this.formValidate}
          onSubmit={this.formSubmit}
            >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            /* and other goodies */
          }) => (
            <div className="upload-portal-form m-b-30">
              <form onSubmit={handleSubmit}
                data-testid="portal-upload-form-container">
                <div className="columns">
                  <div className="column is-3">
                    <div className="field">
                      <label className="label"
                        htmlFor="portal-upload-form-file">
                        Portal.zip or portalserver.xml file file to Upload
                      </label>
                      <div className="control">
                        <input
                          id="portal-upload-form-file"
                          type="file"
                          name="fileUpload"
                          ref={(ref) => { this.fileUploadInput = ref; }}
                          onChange={(event) => {
                            setFieldValue('fileUpload', event.currentTarget.files[0]);
                          }} />
                        <p className="help is-danger"
                          data-testid="portal-upload-file-error">
                          {(errors.fileUpload && touched.fileUpload) && errors.fileUpload}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="column is-3">
                    <div className="field">
                      <label className="label"
                        htmlFor="portal-upload-form-name">
                        File name (No extension needed)
                      </label>
                      <div className="control">
                        <input className={`input ${this.returnDangerClass(errors.fileName && touched.fileName)}`}
                          id="portal-upload-form-name"
                          type="text"
                          name="fileName"
                          onChange={handleChange}
                          value={values.fileName}
                          placeholder="File name" />

                        <p className="help is-danger"
                          data-testid="portal-upload-name-error">
                          {(errors.fileName && touched.fileName) && errors.fileName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="column is-3">
                    <div className="field">
                      <label className="label"
                        htmlFor="portal-upload-form-description">
                        Description
                      </label>
                      <div className="control">
                        <input className={`input ${this.returnDangerClass(errors.description && touched.description)}`}
                          id="portal-upload-form-description"
                          type="text"
                          name="description"
                          onChange={handleChange}
                          value={values.description}
                          placeholder="Description" />
                        <p className="help is-danger"
                          data-testid="portal-upload-description-error">
                          {(errors.description && touched.description) && errors.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="column is-3">
                    <div className="field">
                      <label className="label"
                        htmlFor="portal-upload-form-upload-by">
                        Uploaded By
                      </label>
                      <div className="control">
                        <input className={`input ${this.returnDangerClass(errors.uploadedBy && touched.uploadedBy)}`}
                          id="portal-upload-form-upload-by"
                          type="text"
                          name="uploadedBy"
                          onChange={handleChange}
                          value={values.uploadedBy}
                          placeholder="user name" />
                        <p className="help is-danger"
                          data-testid="portal-upload-by-error">
                          {(errors.uploadedBy && touched.uploadedBy) && errors.uploadedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="submit-box">
                  <button className="button is-primary"
                    type="submit"
                    data-testid="portal-upload-submit-button"
                    disabled={isSubmitting}>
                    Upload Portal.zip or portalserver.xml file
                  </button>
                </div>
              </form>
            </div>
          )}
        </Formik>
      );
    }
}

const mapDispatchToProps = dispatch => ({
  updateXmlList: payload => dispatch(updateXmlList(payload)),
  updateGlobalLoading: payload => dispatch(updateGlobalLoading(payload)),
});
export default connect(null, mapDispatchToProps)(PortalUploadForm);
