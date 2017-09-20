import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { cyan700, blue100, fullWhite, redA700 } from 'material-ui/styles/colors';
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
  margin: 12,
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
      empId: null,
      city: null,
      locationDefault: -1,
      locations: [{ "loc": "Hyderabad" },
      { "loc": "Bangalore" },
      { "loc": "Chennai" },
      { "loc": "Pune" },
      { "loc": "NCR" },
      { "loc": "Kochi" },
      { "loc": "Kolkata" },
      { "loc": "Ahmedabad" },
      { "loc": "Mumbai" }],
      buildingDefault: -1,
      buildings: [],
      locationNotSetDialogOpen: false,
      buildingNotSetDialogOpen: false,
      empIdNotSetDialogOpen: false,
      Message: "default",

    }
  }

  handleValidateButton = (x) => {

    console.log(this.state.empId);

    if (this.state.locationDefault !== -1 && this.state.buildingDefault !== -1 && this.state.empId !== null) {
      fetch(`/api/validate?id=${this.state.empId}&location=${this.state.locationDefault}`, {

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',

        }
      })
      
      .then((response) => { console.log(response);  }) 
        // .then(function (response) {

        //   if (response.status === 409) {
        //     this.message = 'Already Provided With a Book';
        //     console.log('Already Provided With a Book' + response.status);
        //   }
        //   else if (response.status === 404) {
        //     this.message = 'Employee not found in the Database';
        //     // this.setState({ employeeDoesntExist: true, open:true });
        //     console.log('Employee not found in the Db' + response.status);
        //   }
        //   else if (response.status === 200) {
        //     this.message = 'Please give away the book to the employee';

        //     // this.setState({ alreadyProvidedBook: false, open:true });
        //     console.log('Please provide the book to the employee' + response.status);
        //   }
        //   else {
        //     console.log('An unidentified operation has occurred. Please contact Garage Team for help');
        //   }

        // })
        .then(this.setState({ locationNotSetDialogOpen: false, buildingNotSetDialogOpen: false, empIdNotSetDialogOpen: false, Message: this.message, open: true }))
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });


    }
    if (this.state.locationDefault === -1)
      this.setState({ locationNotSetDialogOpen: true }, function () { console.log("locationDefault " + this.state.locationDefault + "locationNotSetDialogOpen:true"); });
    if (this.state.buildingDefault === -1)
      this.setState({ buildingNotSetDialogOpen: true }, function () { console.log("buildingDefault" + this.state.buildingDefault + "buildingNotSetDialogOpen:true"); });
    if (this.state.empId === null)
      this.setState({ empIdNotSetDialogOpen: true }, function () { console.log("empid default" + this.state.empId + "empIdNotSetDialogOpen:true"); });
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
              { "building": "Building 1" },
              { "building": "Building 2" },
              { "building": "Building 3" }

            ]
          });
        break;
      case "Bangalore":
        this.setState(
          {
            buildings: [
              { "building": "Vigyan" },
              { "building": "Signature" },
            ]
          });
        break;

      case "NCR":
        this.setState(
          {
            buildings: [
              { "building": "Gurgaon" },
              { "building": "New Delhi" },
            ]
          });
        break;

      case "Pune":
        this.setState(
          {
            buildings: [
              { "building": "Kumar Business Centre" },
            ]
          });
        break;

      case "Mumbai":
        this.setState(
          {
            buildings: [
              { "building": "Windsor Building" },
            ]
          });
        break;

      case "Kolkata":
        this.setState(
          {
            buildings: [
              { "building": "Millennium City Tower 2" },
            ]
          });
        break;

      case "Kochi":
        this.setState(
          {
            buildings: [
              { "building": "Business Communication Center" },
            ]
          });
        break;

      case "Chennai":
        this.setState(
          {
            buildings: [
              { "building": "Prestige Polygon" },
              { "building": "Millenia Business Park" },
            ]
          });
        break;

      case "Ahmedabad":
        this.setState(
          {
            buildings: [
              { "building": "The Pride Hotel" },
            ]
          });
        break;
      default:
          this.setState({locationDefault:-1, buildingDefault:-1})
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
  handleEmpIdDialogRequestClose() {
    this.setState({ empIdNotSetDialogOpen: false });
  }
  handleClose() {
    this.setState({ open: false, empId: '' });
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
          <img src='/imgs/satya.png' className="App-logo" alt="logo" />
          {/* <h1> <br/>Book <br/>Distribution</h1> */}
        </div>
        <div className="App-footer" style={{ backgroundColor: blue100 }}>
          <FooterContent />
        </div>
        {/* <MuiThemeProvider muiTheme={muiTheme}>
          <TextField className="App-intro"
            hintText="Login Id"
            floatingLabelText="Login Id"
            type="password"
          />
        </MuiThemeProvider> */}

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
<br/> <br/>
        <MuiThemeProvider muiTheme={muiTheme}>

          <TextField className="App-intro"
            hintText="Employee Id"
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
        <MuiThemeProvider muiTheme={muiTheme}>

          <Dialog
            title={this.state.Message}
            actions={actions}
            modal={true}
            open={this.state.open}
          >
          </Dialog>
        </MuiThemeProvider>


        {this.state.empIdNotSetDialogOpen
          &&

          <MuiThemeProvider muiTheme={muiTheme}>

            <Snackbar
              style={{ width: 210 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}
              open={this.state.empIdNotSetDialogOpen}
              message="Emp Id NOT set"
              autoHideDuration={1500}
              onRequestClose={this.handleEmpIdDialogRequestClose.bind(this)} />
          </MuiThemeProvider>

        }
        {this.state.buildingNotSetDialogOpen
          &&
          <MuiThemeProvider muiTheme={muiTheme}>


            <Snackbar
              style={{ width: 210 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}

              open={this.state.buildingNotSetDialogOpen}
              message="Building NOT set"
              autoHideDuration={1000}
              onRequestClose={this.handleBuildingDialogRequestClose.bind(this)} />
          </MuiThemeProvider>
        }
        {this.state.locationNotSetDialogOpen
          &&

          <MuiThemeProvider muiTheme={muiTheme}>

            <Snackbar
              style={{ width: 210 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}
              message="Location NOT set"

              open={this.state.locationNotSetDialogOpen}
              autoHideDuration={500}
              onRequestClose={this.handleLocationDialogRequestClose.bind(this)} />
          </MuiThemeProvider>

        }

      </div >
    );
  }
}

export default App;
