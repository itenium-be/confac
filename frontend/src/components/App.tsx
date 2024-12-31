import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import Header from './Header';

import {ConfacState} from '../reducers/app-state';

// import {success, failure} from '../actions/appActions';
// <button onClick={() => success("greato success")}>Success</button>
// <button onClick={() => failure("oh noes")}>Error</button>


// https://github.com/fkhadra/react-toastify#api
const ConfiguredToastContainer = () => (
  <ToastContainer
    hideProgressBar
    pauseOnHover
    pauseOnFocusLoss={false}
    toastClassName="confac-toast"
  />
);

// Compilation Warnings from react-pdf:
// https://github.com/wojtekmaj/react-pdf/issues/280
// import {Document, pdfjs, Page} from 'react-pdf';
// import {useSelector} from 'react-redux';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// const PdfViewer = () => {
//   const pdf = useSelector(state => state.app.pdf);
//   if (!pdf) {
//     return null;
//   }
//   return (
//     <Document file="http://localhost:3001/api/attachments/invoice/5d57086dd8896886d14732f5/pdf">
//       <Page pageNumber={1} />
//     </Document>
//   )
// }


// eslint-disable-next-line react/prefer-stateless-function
class App extends Component<{children: any}> {
  render() {
    return (
      <div className="App">
        <ConfiguredToastContainer />
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default connect((state: ConfacState) => ({config: state.config, clients: state.clients}))(App);
