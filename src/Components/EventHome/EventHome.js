import React from 'react';
import ReservationHome from '../ReservationHome/ReservationHome';

function EventHome() {


  return (
    <div>
      <p>EventHome</p>

      <table>

        {/* entetes liste evenements */}
        {/* ne pas mapper */}
        <tr>
          <th>Atelier</th>
          <th>Date</th>
          <th>Heure</th>
          <th>adultes</th>
          <th>enfants</th>
          <th>capacité</th>
          <th>modifier</th>
          <th>modifier</th>
          <th>supprimer</th>
          <th>alertes</th>
          <th>alertes</th>
          <th> </th>
        </tr>

        {/* liste des evenements */}
        {/* mapper les evenements futures */}
        <tr>
          <td>Atelier</td>
          <td>Date</td>
          <td>Heure</td>
          <td>adultes</td>
          <td>enfants</td>
          <td>capacité</td>
          <td><i className="material-icons icon-green">create</i></td>
          <td><i className="material-icons icon-green">settings</i></td>
          <td><i className="material-icons icon-green">delete_forever</i></td>
          <td><i className="material-icons icon-green">warning</i></td>
          <td><i className="material-icons icon-green">priority_high</i></td>
          <td><i className="material-icons icon-green">expand_more</i></td>
        </tr>
        <tr>
          <td colSpan="12">
            <table>
              <tr>
                <td>maelenn</td>
                <td>sallic</td>
                <td>ms44118@gmail.com</td>
                <td>0677250296</td>
                <td>550066</td>
                <td>adultes</td>
                <td>enfants</td>
                <td><i className="material-icons icon-green">create</i></td>
                <td><i className="material-icons icon-green">settings</i></td>
                <td><i className="material-icons icon-green">delete_forever</i></td>
                <td><i className="material-icons icon-green">warning</i></td>
                <td><i className="material-icons icon-green">priority_high</i></td>
                <td> </td>
              </tr>
              <tr>
                <td>maelenn</td>
                <td>sallic</td>
                <td>ms44118@gmail.com</td>
                <td>0677250296</td>
                <td>550066</td>
                <td>adultes</td>
                <td>enfants</td>
                <td><i className="material-icons icon-green">create</i></td>
                <td><i className="material-icons icon-green">settings</i></td>
                <td><i className="material-icons icon-green">delete_forever</i></td>
                <td><i className="material-icons icon-green">warning</i></td>
                <td><i className="material-icons icon-green">priority_high</i></td>
                <td> </td>
              </tr>

              <tr>
                <td>maelenn</td>
                <td>sallic</td>
                <td>ms44118@gmail.com</td>
                <td>0677250296</td>
                <td>550066</td>
                <td>adultes</td>
                <td>enfants</td>
                <td><i className="material-icons icon-green">create</i></td>
                <td><i className="material-icons icon-green">settings</i></td>
                <td><i className="material-icons icon-green">delete_forever</i></td>
                <td><i className="material-icons icon-green">warning</i></td>
                <td><i className="material-icons icon-green">priority_high</i></td>
                <td> </td>
              </tr>

              <tr>
                <td>maelenn</td>
                <td>sallic</td>
                <td>ms44118@gmail.com</td>
                <td>0677250296</td>
                <td>550066</td>
                <td>adultes</td>
                <td>enfants</td>
                <td><i className="material-icons icon-green">create</i></td>
                <td><i className="material-icons icon-green">settings</i></td>
                <td><i className="material-icons icon-green">delete_forever</i></td>
                <td><i className="material-icons icon-green">warning</i></td>
                <td><i className="material-icons icon-green">priority_high</i></td>
                <td> </td>
              </tr>

              <tr>
                <td>maelenn</td>
                <td>sallic</td>
                <td>ms44118@gmail.com</td>
                <td>0677250296</td>
                <td>550066</td>
                <td>adultes</td>
                <td>enfants</td>
                <td><i className="material-icons icon-green">create</i></td>
                <td><i className="material-icons icon-green">settings</i></td>
                <td><i className="material-icons icon-green">delete_forever</i></td>
                <td><i className="material-icons icon-green">warning</i></td>
                <td><i className="material-icons icon-green">priority_high</i></td>
                <td> </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

      <ul class="collapsible">
        <li>
          <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
          <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
        </li>
        <li>
          <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
          <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
        </li>
        <li>
          <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
          <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
        </li>
      </ul>


      <ReservationHome />
    </div>
  );
}

export default EventHome;
