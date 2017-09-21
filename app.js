
// added Application Insights to send events, traces and catch exception logs
const appInsights = require("applicationinsights");
appInsights.setup("53191698-6269-4b46-b617-9d9624b6726d")
  .setAutoCollectConsole(true)
  .setAutoDependencyCorrelation(false)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .start();
var client = appInsights.defaultClient;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var azure = require('azure-storage');
var fs = require('fs');
var stringifiedJson = fs.readFileSync('../getValues.json', 'utf8');
var jsonSecrets = JSON.parse(stringifiedJson);

var accessKey = jsonSecrets.storageAccountKey; // '5cBnLmOhF5AA/RC2y2TRYjfATfj+GOUOMT4hsAlM+CMDQaLDMrrY7GOLgdEA0/wSJeGVEOCtwcmU2U3iCBotXg==';
var storageAccount = jsonSecrets.storageAccountName; //'hitrefreshstorage'
var tableService = azure.createTableService(storageAccount, accessKey);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


//*******VALIDATE API**********//
app.get('/api/validate', (req, res, err) => {
  tableService.createTableIfNotExists('employees', function (error, result, response) {
    if (!error) {
      // table exists or created
      // result contains true if created; false if already exists
      if (result.created) {
        console.log("new table is created !");
      }
      else {
        console.log("table already existed!")
        tableService.retrieveEntity('employees', "A", req.query.id + "", function (err, result, response) {
          if (!err) {
            // result contains the entity
            if (result) {
              if (result.Received['_'] == true) {
                console.log(`book has already been collected by the employee EmployeeId:${req.query.id} \n IssueLocation: ${req.query.location} \n IssueBuilding: ${req.query.building }`);
                res.status(409).json({ "message": "Book Already Collected!" }).end();
              }
              else {
                var entGen = azure.TableUtilities.entityGenerator;

                var task = {
                  PartitionKey: "A",
                  RowKey: entGen.String(req.query.id),
                  Received: true,
                  CollectedFrom: entGen.String(req.query.location + " " + req.query.building)
                }
                tableService.mergeEntity('employees', task, function (err, result, respose) {
                  if (!error) {
                    console.log(`book has been provided to the employee EmployeeId:${req.query.id} \n IssueLocation: ${req.query.location} \n IssueBuilding: ${req.query.building }`);

                    res.status(200).json({ "message": "Please Provide the Book." }).end();

                  }
                  else {
                    console.log(`Something Went Wrong: err:  \n EmployeeId: ${req.query.id} IssueLocation: ${req.query.location} IssueBuilding: ${req.query.building}`);
                    // console.log(error + "= Something went wrong!");
                    res.status(200).json({ "message": err + "...msg" }).end();

                  }
                });
              }
            }
            else{
              console.log(`Result not created. error:  EmployeeId: ${req.query.id} \n IssueLocation: ${req.query.location} IssueBuilding: ${req.query.building }`);
            }
          }
          else {
            console.log(`Record Not Found for this employee id.  empId: ${req.query.id} \n IssueLocation: ${req.query.location} \n IssueBuilding: ${req.query.building}`);
            // console.log("Record Not Found for this employee id !!");
            res.status(404).json({ "message": "Employee with this ID Not Found in DB" }).end();
          }
        });

      }

    }
    else {
      console.log(`table which stores the employee data does not already exists EmployeeId:${req.query.id} \n IssueLocation: ${req.query.location} \n  IssueBuilding: ${req.query.building}`);
      // console.log("table which stores the employee data does not already exists!");
    }
  });

});

//**********USER LOGIN API ************/
// AUTHOR: Meghna Masand
app.get('/api/login', (req, res, err) => {
  tableService.createTableIfNotExists('distributors', function (error, result, response) {
    if (!error) {
      // table exists or created
      // result contains true if created; false if already exists
      if (result.created) {
        console.log("distributor new table is created !");
      }
      else {
        console.log("distributor table already existed!")
        tableService.retrieveEntity('distributors', "A", req.query.id + "", function (error, result, response) {
          if (!error) {
            // result contains the entity
            if (result) {
              //console.log(result);
              {
                console.log("FouND!!");
                //console.log(result.Received['_']);
                //console.log("is this getting printed");
                var entGen = azure.TableUtilities.entityGenerator;
                console.log(req.query.Building);
                var task = {
                  PartitionKey: "A",
                  RowKey: entGen.String(req.query.id),
                  Location: entGen.String(req.query.location),
                  Building: entGen.String(req.query.Building)
                }
                tableService.mergeEntity('distributors', task, function (err, result, response) {
                  if (!error) {
                    
                    console.log(`Entry updated in Db for the issue address. Login Success. IssuerId:${req.query.id} \n IssueLocation: ${req.query.location} \n IssueBuilding: ${req.query.building }`);
                    res.status(200).json({ "message": "Login Success!" }).end();

                  }
                  else {
                    console.log(`Something went wrong while trying Issuer Login. issuerId: ${req.query.id} \n IssueLocation: ${req.query.location} \n IssueBuilding: ${req.query.building}`);
                    res.status(200).json({ "message": error + "...msg" }).end();

                  }
                });
              }
            }
          }
          else {
            console.log(`Record Not Found for this issuer id.  issuer Id: ${req.query.id} \n IssueLocation: ${req.query.location} \n IssueBuilding: ${req.query.Building}`);
            res.status(404).json({ "message": "issuer id not found in db" }).end();
          }
        });

      }

    }
    else {
      console.log("table which stores the user id data does not already exists!");
    }
  });

});





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
