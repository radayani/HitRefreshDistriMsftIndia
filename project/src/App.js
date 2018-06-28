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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FaRefresh from 'react-icons/lib/fa/refresh';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  marginBottom: 70,
  customWidthBuilding: {
    width: 350
  },
  customWidthLocation: {
    width: 200
  }, 
  card: {
    width: 200,
    align: 'center',
    textAlign: 'center'
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
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
      issuerIdWrongDialogOpen: false,
      issuerIdAlreadyInUseDialogOpen: false,
      countOfRegistrations:0,
      countHappening:false

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
          if (res.status == 200)
            this.setState({ loginPage: false }, function () { console.log("changed loginPage state") });
          else if (res.status == 300)
            this.setState({  issuerIdAlreadyInUseDialogOpen: true });
          else if(res.status == 404)
          this.setState({  issuerIdWrongDialogOpen: true });          
          
        })
        .catch(function (err) {
          console.log('Fetch Error :-S', err);
        });


    }
    if (this.state.issuerId === "")
      this.setState({ issuerIdNotSetDialogOpen: true });

    if (this.state.locationDefault === -1)
      this.setState({ locationNotSetDialogOpen: true });
    if (this.state.buildingDefault === -1)
      this.setState({ buildingNotSetDialogOpen: true });

  }

  handleRefreshButton = (x) => {
    this.setState({countHappening:true});
    fetch(`/api/countRegistrations`, {
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
      this.setState({countOfRegistrations: res.data.count, countHappening:false}, function(){
        console.log(this.state.countOfRegistrations);
      });
      console.log(res.status, res.data.count);
    })
    .catch(function(err){
      console.log('Fetch error: ', err);
    });
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
              { "building": "B1 Reception Lobby" },
              { "building": "B2 Reception Lobby" },
              { "building": "B3 Reception Lobby" }

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
    this.setState({ issuerIdNotSetDialogOpen: false, issuerIdWrongDialogOpen: false, issuerIdAlreadyInUseDialogOpen: false });
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

          <img src='/imgs/igdmeet.jpg' className="App-header" alt="logo" />
          {/* <p> Distribution</p> */}

        </div>
        <div className="App-footer" style={{ backgroundColor: blue100 }}>
          <FooterContent />
        </div>
        {this.state.loginPage &&
          <div>

            <MuiThemeProvider muiTheme={muiTheme}>

              <DropDownMenu
                style={style.customWidthLocation}
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
                style={style.customWidthBuilding}
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
                hintText="Enter your 8-digit OTP"
                style={{ marginRight: 65 }}
                onChange={this.handleIssuerIdValueChange.bind(this)}
                floatingLabelText="Issuer OTP"
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
            <MuiThemeProvider muiTheme={muiTheme}>
              <Card style={{ marginRight: 50, marginLeft: 50 }}>
                <CardContent>
                  <Typography style={style.title} color="textSecondary">
                    No. of Registrations Done
                  </Typography>
                  <Typography variant="headline" component="h2">
                    {this.state.countOfRegistrations} 
        {this.state.countHappening == false && <FaRefresh style ={{marginLeft:50}} onClick = {this.handleRefreshButton.bind(this)}/>}
        {this.state.countHappening == true && <CircularProgress style ={{marginLeft:50}} size={20}/> 
                    }
                  </Typography>
                </CardContent>
              </Card>
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

        {this.state.issuerIdWrongDialogOpen
          &&

          <MuiThemeProvider muiTheme={muiTheme}>

            <Snackbar
              style={{ width: 300 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}
              open={this.state.issuerIdWrongDialogOpen}
              message="Invalid Issuer OTP"
              autoHideDuration={2100}
              onRequestClose={this.handleIssuerIdDialogRequestClose.bind(this)} />
          </MuiThemeProvider>

        }

        {this.state.issuerIdAlreadyInUseDialogOpen
          &&

          <MuiThemeProvider muiTheme={muiTheme}>

            <Snackbar
              style={{ width: 300 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}
              open={this.state.issuerIdAlreadyInUseDialogOpen}
              message="Issuer OTP Already in Use"
              autoHideDuration={2100}
              onRequestClose={this.handleIssuerIdDialogRequestClose.bind(this)} />
          </MuiThemeProvider>

        }


        {this.state.issuerIdNotSetDialogOpen
          &&

          <MuiThemeProvider muiTheme={muiTheme}>

            <Snackbar
              style={{ width: 300 }}
              contentStyle={{ color: fullWhite }}
              bodyStyle={{ backgroundColor: redA700 }}
              open={this.state.issuerIdNotSetDialogOpen}
              message="Please fill Issuer OTP Provided to You"
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
