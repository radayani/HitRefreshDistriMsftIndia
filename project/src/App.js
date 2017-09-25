import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { cyan700, blue100, blue200, fullWhite, redA700 } from 'material-ui/styles/colors';
import FooterContent from './FooterContent';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import './App.css';




import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme({
  palette: {
    textColor: cyan700,
  },
  appBar: {
    height: 50,
  },
});

const style = {
  margin: 1,
  marginBottom:70,
  customWidth: {
    width: 200
  }
};


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      foundInDb: false,
      empId: "",
      city: null,
      locationDefault: -1,
      locations: [{ "loc": "Hyderabad" },
      { "loc": "Bangalore" },
      { "loc": "Noida" },
      { "loc": "GSMO" },
      { "loc": "Pune" }],
      buildingDefault: -1,
      buildings: [],
      locationNotSetDialogOpen: false,
      buildingNotSetDialogOpen: false,
      issuerIdNotSetDialogOpen: false,
      empIdNotSetDialogOpen: false,
      Message: "",
      loginPage: true,
      issuerId: "",
      issuerIdWrong:false

    }
  }


  handleLoginButton = (x) => {
    if (this.state.issuerId !== "" && this.state.locationDefault !== -1 && this.state.buildingDefault !== -1) {

      fetch(`/api/login?id=${this.state.issuerId}&location=${this.state.locationDefault}&Building=${this.state.buildingDefault}`, {

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',

        }
      })
        .then(response =>
          response.json().then(data => ({
            data: data,
            status: response.status
          })))
        .then(res => {
          if(res.status == 200)
          this.setState({ loginPage: false }, function () 
            { console.log("changed loginPage state") })
          else
          this.setState({ issuerIdWrong: true, issuerIdNotSetDialogOpen:true }, function () 
          { console.log("WRONG!!!!!") })
            
        })
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });


    }
    if (this.state.issuerId === "")
      this.setState({ issuerIdNotSetDialogOpen: true }, function () { console.log("issuerIdNotSetDialogOpen " + this.state.issuerIdNotSetDialogOpen + "issuerIdNotSetDialogOpen:true"); });

    if (this.state.locationDefault === -1)
      this.setState({ locationNotSetDialogOpen: true }, function () { console.log("locationDefault " + this.state.locationDefault + "locationNotSetDialogOpen:true"); });
    if (this.state.buildingDefault === -1)
      this.setState({ buildingNotSetDialogOpen: true }, function () { console.log("buildingDefault" + this.state.buildingDefault + "buildingNotSetDialogOpen:true"); });

  }




  handleValidateButton = (x) => {

    console.log(this.state.empId);

    if (this.state.locationDefault !== -1 && this.state.buildingDefault !== -1 && this.state.empId !== "") {
      fetch(`/api/validate?id=${this.state.empId}&location=${this.state.locationDefault}&building=${this.state.buildingDefault}`, {

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',

        }
      })
        .then(response =>
          response.json().then(data => ({
            data: data,
            status: response.status
          })))
        .then(res => {
          this.setState({ Message: res.data.message }, function () {
            console.log(this.state.Message);

          });
          console.log(res.status, res.data.message);
        })
        .then(this.setState({ locationNotSetDialogOpen: false, buildingNotSetDialogOpen: false, empIdNotSetDialogOpen: false, open: true }))
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });


    }
    if (this.state.empId === "")
      this.setState({ empIdNotSetDialogOpen: true }, function () { console.log("empid default" + this.state.empId + "empIdNotSetDialogOpen:true"); });
  }
  handleIssuerIdValueChange(event, newValue) {
    this.setState({ issuerId: newValue }, function () {
      console.log(this.state.issuerId);
    });
  }
  handleEmployeeIdValueChange(event, newValue) {
    this.setState({ empId: newValue }, function () {
      console.log(this.state.empId);
    });
  }
  handleLocationSelection(event, index, value) {
    this.setState({ locationDefault: value, buildingDefault: -1 }, function () {
      console.log("hi")

    });
    switch (value) {
      case "Hyderabad":
        this.setState(
          {
            buildings: [
              { "building": "B#1 Reception Lobby" },
              { "building": "B#2 Reception Lobby" },
              { "building": "B#3 Reception Lobby" }

            ]
          });
        break;
      case "Bangalore":
        this.setState(
          {
            buildings: [
              { "building": "Vigyan Reception Lobby" },
              { "building": "GTSC Signature Cafe 3rd Floor" },
              { "building": "GTSC Embassy Reception 3rd Floor" },              
              { "building": "GTSC Embassy Cafe 5th Floor" },
              { "building": "Manyata Tech Park Reception Lobby" },
              { "building": "We Works 5th Floor Pantry" },
              { "building": "JNRCT Reception Lobby" }
              
              
            ]
          });
        break;

      case "Noida":
        this.setState(
          {
            buildings: [
              { "building": "ETT In Person Distribution" }
            ]
          });
        break;

      case "Pune":
        this.setState(
          {
            buildings: [
              { "building": "KBC Ivory Conf Room" },
              { "building": "Pansheel IDC Reception" }
              
            ]
          });
        break;

      case "GSMO":
        this.setState(
          {
            buildings: [
              { "building": "Mumbai Customer Area" },
              { "building": "Gurugram Customer Area" },
              { "building": "Kolkata Recreation Area" },
              { "building": "Chennai RMZ Recreation Area" },
              { "building": "Chennai Poly MPR-1" },              
              { "building": "Hyd Jubilee Pantry Area" },
              { "building": "Bangalore Reception Area" }              
            ]
          });
        break;
      default:
        this.setState({ locationDefault: -1, buildingDefault: -1 })
    }
  }

  handleBuildingSelection(event, index, value) {
    this.setState({ buildingDefault: value }, function () {
      console.log("hi")
    });
  }

  handleLocationDialogRequestClose() {
    this.setState({ locationNotSetDialogOpen: false });
  }
  handleBuildingDialogRequestClose() {
    this.setState({ buildingNotSetDialogOpen: false });
  }
  handleIssuerIdDialogRequestClose() {
    this.setState({ issuerIdNotSetDialogOpen: false,issuerIdWrong:false });
  }
  handleEmpIdDialogRequestClose() {
    this.setState({ empIdNotSetDialogOpen: false });
  }
  handleClose() {
    this.setState({ open: false, empId: '', Message: "" });
  }
  render() {
    const actions = [
      <FlatButton
        label="Done"
        primary={true}
        onClick={this.handleClose.bind(this)}
      />,

    ];

    return (
      <div className="App">
        <div className="App-header">
          {/* <h1> <br/><span style={{color:blue100}}>Hit Refresh</span><br/></h1> <h3> <span style={{color:blue100}}><pre>     - Satya Nadella</pre></span></h3><h1>Book<br/>Distribution<br/></h1> */}
          
          <img src='/imgs/satya.png' className="App-header"  alt="logo" />
          {/* <p> Distribution</p> */}
        
        </div>
        <div className="App-footer" style={{ backgroundColor: blue100 }}>
          <FooterContent />
        </div>
        {this.state.loginPage &&
          <div>

            <MuiThemeProvider muiTheme={muiTheme}>

              <DropDownMenu
                style={style.customWidth}
                onChange={this.handleLocationSelection.bind(this)}
                autoWidth={true}
                maxHeight={250}
                value={this.state.locationDefault}  >

                <MenuItem value={-1} primaryText="Select Location" />
                {this.state.locations.map(function (elem, i) {
                  return (
                    <MenuItem value={elem.loc} primaryText={elem.loc} key={i} />
                  );
                }, this)}

              </DropDownMenu>
            </MuiThemeProvider>

            <MuiThemeProvider muiTheme={muiTheme}>
              <DropDownMenu
                style={style.customWidth}
                onChange={this.handleBuildingSelection.bind(this)}
                autoWidth={true}
                value={this.state.buildingDefault}
              >
                <MenuItem value={-1} primaryText="Select Building" />
                {this.state.buildings.map(function (elem, i) {
                  return (
                    <MenuItem value={elem.building} primaryText={elem.building} key={i} />
                  );
                }, this)}
              </DropDownMenu>
            </MuiThemeProvider>
            <br /><br />

            <MuiThemeProvider muiTheme={muiTheme}>
              <TextField className="App-intro"
                hintText="Enter your 7-digit login code"
                style={{ marginRight: 15 }}
                onChange={this.handleIssuerIdValueChange.bind(this)}
                floatingLabelText="Issuer Login Id"
                type="password"
              />
            </MuiThemeProvider>

            <MuiThemeProvider muiTheme={muiTheme}>

              <RaisedButton
                label="Login"
                style={style}
                keyboardFocused={true}
                onTouchTap={this.handleLoginButton.bind(this, "dsfdsfdsf")}

              />
            </MuiThemeProvider>
          </div>
        }
        {!this.state.loginPage &&
          <div>
            <MuiThemeProvider muiTheme={muiTheme}>


              <TextField className="App-intro"
                hintText="Employee Id"
                style={{ marginRight: 15 }}
                
                floatingLabelText="Employee Id"
                value={this.state.empId}
                onChange={this.handleEmployeeIdValueChange.bind(this)}

                type="text"
              />
            </MuiThemeProvider>
            <MuiThemeProvider muiTheme={muiTheme}>

              <RaisedButton
                label="Validate"
                style={style}
                keyboardFocused={true}
                onTouchTap={this.handleValidateButton.bind(this, "dsfdsfdsf")}

              />


            </MuiThemeProvider>
          </div>
        }
        <MuiThemeProvider muiTheme={muiTheme}>

          <Dialog
            title={this.state.Message}
            actions={actions}
            modal={true}
            open={this.state.open}
          >
          </Dialog>
        </MuiThemeProvider>

        {(this.state.issuerIdNotSetDialogOpen && this.state.issuerIdWrong)
          &&

          <MuiThemeProvider muiTheme={muiTheme}>

            <Snackbar
              style={{ width: 300 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}
              open={this.state.issuerIdNotSetDialogOpen}
              message="Incorrect Issuer Id"
              autoHideDuration={2100}
              onRequestClose={this.handleIssuerIdDialogRequestClose.bind(this)} />
          </MuiThemeProvider>

        }

        {(this.state.issuerIdNotSetDialogOpen && !this.state.issuerIdWrong)
          &&

          <MuiThemeProvider muiTheme={muiTheme}>

            <Snackbar
              style={{ width: 300 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}
              open={this.state.issuerIdNotSetDialogOpen}
              message="Please fill Issuer Id Provided to You"
              autoHideDuration={2000}
              onRequestClose={this.handleIssuerIdDialogRequestClose.bind(this)} />
          </MuiThemeProvider>

        }

        {this.state.empIdNotSetDialogOpen
          &&

          <MuiThemeProvider muiTheme={muiTheme}>

            <Snackbar
              style={{ width: 300 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}
              open={this.state.empIdNotSetDialogOpen}
              message="Please fill the Employee's ID"
              autoHideDuration={2000}
              onRequestClose={this.handleEmpIdDialogRequestClose.bind(this)} />
          </MuiThemeProvider>

        }
        {this.state.buildingNotSetDialogOpen
          &&
          <MuiThemeProvider muiTheme={muiTheme}>


            <Snackbar
              style={{ width: 300 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}

              open={this.state.buildingNotSetDialogOpen}
              message="Please select your BUILDING"
              autoHideDuration={1400}
              onRequestClose={this.handleBuildingDialogRequestClose.bind(this)} />
          </MuiThemeProvider>
        }
        {this.state.locationNotSetDialogOpen
          &&

          <MuiThemeProvider muiTheme={muiTheme}>

            <Snackbar
              style={{ width: 300 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}
              message="Please select your LOCATION"

              open={this.state.locationNotSetDialogOpen}
              autoHideDuration={700}
              onRequestClose={this.handleLocationDialogRequestClose.bind(this)} />
          </MuiThemeProvider>

        }

      </div >
    );
  }
}

export default App;
