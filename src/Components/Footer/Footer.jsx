import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './Footer.css';

const Footer = () => (
  <footer className="page-footer">
    <div className="container">
      <div className="row">
        <div className="col l6 s12">
          <h5 className="white-text">Footer Content</h5>
          <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
        </div>
        <div className="col l4 offset-l2 s12">
          <h5 className="white-text">Links</h5>
          <ul>
            <li><a href="#!">Link 1</a></li>
            <li><a className="grey-text text-lighten-3" href="#!">Link 2</a></li>
            <li><a className="grey-text text-lighten-3" href="#!">Link 3</a></li>
            <li><a className="grey-text text-lighten-3" href="#!">Link 4</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer-copyright">
      <div className="container">
      © 2014 Copyright Text
      <a className="grey-text text-lighten-4 right" href="#!">More Links</a>
      </div>
    </div>
  </footer>


  // <footer className="page-footer">
  //   <div className="footer-copyright">
  //     <div className="container">
  //       <a href="https://www.wildcodeschool.fr" rel="noopener noreferrer" target="_blank">wild code school</a>
  //       <a href="https://www.lacocottesolidaire.fr" rel="noopener noreferrer" target="_blank"> x la cocotte solidaire</a>
  //     </div>
  //   </div>
  // </footer>

);

export default Footer;
