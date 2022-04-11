import {
  Button,
  Card,
  Checkbox,
  Grid,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "./Employeeform.css";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const localData = () => {
  let list = localStorage.getItem("data");
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

const Employeeform = () => {
  const [userRegistration, setUserRegistration] = useState({
    name: "",
    address: "",
    mobile: "",
    net: "",
    deduction: "",
    gross: "",
    designation: "",
  });
  const [records, setRecords] = useState(localData());
  const [searchTerm, setSearchTerm] = useState("");
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  const [multipleSelect, setMultipleSelect] = useState(false);
  const [multipleSelectId, setMultipleSelectId] = useState([]);
  // const [confirmDialog, setConfirmDialog] = useState(false);

  const inputHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserRegistration({ ...userRegistration, [name]: value });
  };
  const submitHandler = (event) => {
    event.preventDefault();
    if (
      !userRegistration.name ||
      !userRegistration.address ||
      !userRegistration.mobile ||
      !userRegistration.net ||
      !userRegistration.deduction ||
      !userRegistration.designation
    ) {
      alert("plz fill data");
    } else if (userRegistration && !toggleSubmit) {
      setRecords(
        records.map((elem) => {
          if (elem.id === isEditItem) {
            return { ...elem, name: userRegistration };
          }
          return elem;
        })
      );
      setToggleSubmit(true);
      setUserRegistration({
        name: "",
        address: "",
        mobile: "",
        net: "",
        deduction: "",
        gross: "",
        designation: "",
      });
      setIsEditItem(null);
    } else {
      const allInputData = {
        id: new Date().getTime().toString(),
        name: userRegistration,
      };
      setRecords([...records, allInputData]);
      setUserRegistration({
        name: "",
        address: "",
        mobile: "",
        net: "",
        deduction: "",
        gross: "",
        designation: "",
      });
    }
  };

  const editEmployeeHandler = (id) => {
    let newEditItem = records.find((elem) => {
      return elem.id === id;
    });
    setToggleSubmit(false);
    setUserRegistration(newEditItem.name);
    setIsEditItem(id);
  };
  const multiSelectHandler = (id) => {
    setMultipleSelect(true);
    setMultipleSelectId([...multipleSelectId.concat(id)]);
  };
  const dataLength = (dataLen) => {
    let flietr;
    if (!multipleSelectId.includes(dataLen?.id)) {
      flietr = dataLen;
    }
    return flietr;
  };
  let j = 0;
  const arr = [];
  const recursive = () => {
    const i = records.length;
    if (i > j) {
      const data = dataLength(records[j]);
      if (data) arr.push(data);
      j += 1;
      recursive();
    }
    return arr;
  };
  const removeSelected = () => {
    const multi = recursive();
    localStorage.setItem("data", JSON.stringify(multi));
    setRecords(multi);
    setMultipleSelectId([]);
  };

  const deleteEmployeeHandler = (index) => {
    setRecords((oldrecord) => {
      return oldrecord.filter((ele) => {
        return index !== ele.id;
      });
    });
    // console.log(index);
  };

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(records));
  }, [records]);

  const backgroundColor = (data) => {
    let value;
    if (data > 50000) {
      value = "blue";
    } else if (data < 10000) {
      value = "green";
    } else {
      value = "yellow";
    }
    return value;
  };
  const [isPrintClicked, setisPrintClicked] = useState(false);
  const printPreview = () => {
    // try {
    //   document.execCommand("print", false, null);
    // } catch {

    // }
    setisPrintClicked(true);
    setTimeout(
      function () {
        window.print();
      }.bind(this),
      1000
    );
  };
  return (
    <div>
      <Card>
        <div className="empform">
          <form onSubmit={submitHandler} className="form">
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={userRegistration.name}
                  onChange={inputHandler}
                />
                <hr />
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  value={userRegistration.address}
                  onChange={inputHandler}
                />
                <hr />
                <TextField
                  fullWidth
                  type="number"
                  name="mobile"
                  label="Mobile"
                  value={userRegistration.mobile}
                  onChange={inputHandler}
                />
                <hr />
                <TextField
                  fullWidth
                  type="number"
                  name="net"
                  label="Net Pay"
                  value={userRegistration.net}
                  onChange={inputHandler}
                />
                <hr />
                <TextField
                  fullWidth
                  type="number"
                  name="deduction"
                  label="Deduction"
                  value={userRegistration.deduction}
                  onChange={inputHandler}
                />
                <hr />
                <TextField
                  fullWidth
                  type="number"
                  name="gross"
                  label="Gross Pay"
                  value={userRegistration.net - userRegistration.deduction}
                  onChange={inputHandler}
                />
                <hr />
                <TextField
                  fullWidth
                  name="designation"
                  label="Designation"
                  value={userRegistration.designation}
                  onChange={inputHandler}
                />
                <hr />
                {toggleSubmit ? (
                  <>
                    <Button type="submit" variant="contained">
                      Register
                    </Button>
                    <br />
                    <div style={{ margin: "10px 0 " }}>
                      <Button variant="contained" onClick={printPreview}>
                        print
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button type="submit" variant="contained">
                    Edit
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
          {isPrintClicked && <p>print</p>}
        </div>
      </Card>
      <div className="empgrid">
        <InputBase
          placeholder="Search Employees"
          startAdornment={<SearchIcon fontSize="small" />}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <TableContainer>
          <Table style={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell key="name">Name</TableCell>
                <TableCell key="address">Address</TableCell>
                <TableCell key="mobile">Mobile</TableCell>
                <TableCell key="net">Net Pay</TableCell>
                <TableCell key="deduction">Deduction</TableCell>
                <TableCell key="gross">Gross Pay</TableCell>
                <TableCell key="designation">Designation</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            {records
              .filter((curEle) => {
                if (searchTerm === "") {
                  return curEle;
                } else if (
                  curEle.name.gross ||
                  curEle.name.net - curEle.name.deduction < searchTerm
                ) {
                  return curEle;
                }
              })
              .map((curEle) => {
                return (
                  <TableBody key={curEle.id}>
                    <TableRow
                      style={{
                        backgroundColor: backgroundColor(curEle?.name?.gross),
                      }}
                    >
                      <Checkbox
                        onChange={() => multiSelectHandler(curEle?.id)}
                      />
                      <TableCell>{curEle?.name?.name}</TableCell>
                      <TableCell>{curEle?.name?.address}</TableCell>
                      <TableCell>{curEle?.name?.mobile}</TableCell>
                      <TableCell>{curEle?.name?.net}</TableCell>
                      <TableCell>{curEle?.name?.deduction}</TableCell>
                      <TableCell>
                        {curEle?.name?.gross ||
                          curEle?.name?.net - curEle?.name?.deduction}
                      </TableCell>
                      <TableCell>{curEle?.name?.designation}</TableCell>
                      <TableCell>
                        <EditIcon
                          onClick={() => editEmployeeHandler(curEle.id)}
                        />
                        <CloseIcon
                          onClick={() => deleteEmployeeHandler(curEle.id)}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              })}
          </Table>
        </TableContainer>
      </div>
      {multipleSelect && (
        <Button variant="contained" onClick={removeSelected} className="remove">
          Remove Selected
        </Button>
      )}
      {/* <Dialog open={confirmDialog}>
        <DialogTitle>"Are you sure to delete the record"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "You cannot undo this operation"
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmDialog(false);
            }}
          >
            No
          </Button>
          <Button onClick={deleteEmployeeHandler}>Yes</Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default Employeeform;
