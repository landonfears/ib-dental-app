import React, { Component } from "react";
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import moment from 'moment';
import './App.css';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Dentist Name", field: "dentistName" },
        { title: "Patient Name", field: "patientName" },
        { 
          title: "Start Time", 
          field: "startTime", 
          type: "datetime", 
          render: rowData => moment(rowData.startTime).format('LLLL')
        },
        { 
          title: "End Time", 
          field: "endTime", 
          type: "datetime", 
          render: rowData => moment(rowData.endTime).format('LLLL')
        }
      ],
      data: [
        {
          dentistName: "Jane Smith",
          patientName: "Joe Lewis",
          startTime: moment().seconds(0).milliseconds(0).add(1, 'days').add(5, 'minutes'),
          endTime: moment().seconds(0).milliseconds(0).add(1, 'days').add(35, 'minutes')
        },
        {
          dentistName: "Lucy Jones",
          patientName: "Mary Washington",
          startTime: moment().seconds(0).milliseconds(0).add(2, 'days').add(5, 'minutes'),
          endTime: moment().seconds(0).milliseconds(0).add(2, 'days').add(45, 'minutes')
        }
      ],
      message: {
        active: false,
        text: ''
      }
    }
  }

  _handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({message: false});
  };

  _onClose = () => {
    this.setState({message: false});
  }

  _validate = (newData, data) => {
    let now = moment();
    let start = moment(newData.startTime);
    let end = moment(newData.endTime);
    let minEnd = moment(start).add(30, 'minutes');
    let message = '';
    let duplicate = data.filter(record => {
      let recordMoment = moment(record.startTime);
      return (
        record.dentistName === newData.dentistName && 
        Math.abs(recordMoment.diff(start, 'minutes')) === 0
      );
    });
    if (!newData.dentistName || !newData.patientName) {
      message = 'Please enter both the Dentist and Patient Name';
    } else if (now > start || now > end) {
      message = 'Start and End Time must be valid times in the future.';
    } else if (end.isBefore(minEnd)) {
      message = 'End Time must be at least 30 minutes after Start Time.'
    } else if (duplicate.length) {
      message = 'A dentist with this name has an appointment starting at the same time!';
    }
    return message;
  }

  render() {
    return (
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          icons={tableIcons}
          title="Dental Appointments"
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  let errorMessage = this._validate(newData, this.state.data);
                  if (!errorMessage) {
                    const data = this.state.data;
                    data.push(newData);
                    this.setState({ data }, () => resolve());
                    resolve();
                  } else {
                    this.setState({message: { active: true, text: errorMessage }})
                    reject();
                  }
                }, 1000)
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    let data = this.state.data;
                    const index = data.indexOf(oldData);
                    data.splice(index, 1);
                    this.setState({ data }, () => resolve());
                  }
                  resolve()
                }, 1000)
              }),
          }}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.message.active}
          autoHideDuration={6000}
          onClose={this._handleClose}
        >
          <SnackbarContent
            aria-describedby="client-snackbar"
            id="App-warning"
            message={
              <span id="client-snackbar">
                {this.state.message.text}
              </span>
            }
            action={[
              <IconButton key="close" aria-label="close" color="inherit" onClick={this._onClose}>
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </Snackbar>
      </div>
    );
  }
}

export default App;
