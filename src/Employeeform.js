import { findDOMNode } from "react-dom";
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
  const onAfterPrint = () => {
    // serIsPrintClicked(false)
  };

  // console.log("printIsClicked", currentRef);

  const startPrint = (target) => {
    // const {
    //     onAfterPrint,
    //     onPrintError,
    //     print,
    // } = this.props;

    console.log(target);

    setTimeout(() => {
      if (target.contentWindow) {
        target.contentWindow.focus(); // Needed for IE 11
        if (target.contentWindow.print) {
          // const tempContentDocumentTitle = target.contentDocument?.title ?? '';
          // const tempOwnerDocumentTitle = target.ownerDocument.title;

          // // Override page and various target content titles during print
          // // NOTE: some browsers seem to take the print title from the highest level
          // // title, while others take it from the lowest level title. So, we set the title
          // // in a few places and hope the current browser takes one of them :pray:
          // if (documentTitle) {
          //     // Print filename in Chrome
          //     target.ownerDocument.title = documentTitle;

          //     // Print filename in Firefox, Safari
          //     if (target.contentDocument) {
          //         target.contentDocument.title = documentTitle;
          //     }
          // }

          target.contentWindow.print();

          // Restore the page's original title information

          if (onAfterPrint) {
            onAfterPrint();
          }
        }
      }
    }, 500);
  };

  const onBeforePrint = () => {
    console.log("Before Printing");
    return Promise;
  };

  const onPrintError = (error) => {
    console.log("error", error);
  };

  const triggerPrint = (target) => {
    if (onBeforePrint) {
      const onBeforePrintOutput = onBeforePrint();
      if (
        onBeforePrintOutput &&
        typeof onBeforePrintOutput.then === "function"
      ) {
        onBeforePrintOutput
          .then(() => {
            startPrint(target);
          })
          .catch((error) => {
            if (onPrintError) {
              onPrintError("onBeforePrint", error);
            }
          });
      } else {
        startPrint(target);
      }
    } else {
      startPrint(target);
    }
  };

  const printPreview = () => {
    let nonce;
    let bodyClass;
    let copyStyles;
    let fonts;
    let pageStyle;
    const printWindow = document.createElement("iframe");
    printWindow.style.position = "absolute";
    printWindow.style.top = "-1000px";
    printWindow.style.left = "-1000px";
    printWindow.id = "printWindow";
    printWindow.srcdoc = "<!DOCTYPE html>";
    document.body.appendChild(printWindow);

    let contentEl = document.getElementById("print");
    const contentNodes = findDOMNode(contentEl);

    // React components can return a bare string as a valid JSX response
    const clonedContentNodes = contentNodes.cloneNode(true);
    const isText = clonedContentNodes instanceof Text;

    const globalStyleLinkNodes = document.querySelectorAll(
      "link[rel='stylesheet']"
    );
    const renderComponentImgNodes = isText
      ? []
      : clonedContentNodes.querySelectorAll("img");
    const renderComponentVideoNodes = isText
      ? []
      : clonedContentNodes.querySelectorAll("video");

    let linkTotal =
      globalStyleLinkNodes.length +
      renderComponentImgNodes.length +
      renderComponentVideoNodes.length;
    const linksLoaded = [];
    const linksErrored = [];
    const fontsLoaded = [];
    const fontsErrored = [];

    const markLoaded = (linkNode, loaded) => {
      if (loaded) {
        linksLoaded.push(linkNode);
      } else {
        //  logMessages(['"react-to-print" was unable to load a linked node. It may be invalid. "react-to-print" will continue attempting to print the page. The linked node that errored was:', linkNode]); // eslint-disable-line max-len
        linksErrored.push(linkNode);
      }

      // We may have errors, but attempt to print anyways - maybe they are trivial and the
      // user will be ok ignoring them
      const numResourcesManaged =
        linksLoaded.length +
        linksErrored.length +
        fontsLoaded.length +
        fontsErrored.length;

      if (numResourcesManaged === linkTotal) {
        triggerPrint(printWindow);
      }
    };

    printWindow.onload = () => {
      // Some agents, such as IE11 and Enzyme (as of 2 Jun 2020) continuously call the
      // `onload` callback. This ensures that it is only called once.
      printWindow.onload = null;

      const domDoc =
        printWindow.contentDocument || printWindow.contentWindow?.document;

      if (domDoc) {
        domDoc.body.appendChild(clonedContentNodes);

        //   if (fonts) {
        //     if (
        //       printWindow.contentDocument?.fonts &&
        //       printWindow.contentWindow?.FontFace
        //     ) {
        //       fonts.forEach((font) => {
        //         const fontFace = new FontFace(font.family, font.source);
        //         printWindow.contentDocument.fonts.add(fontFace);
        //         fontFace.loaded
        //           .then((loadedFontFace) => {
        //             fontsLoaded.push(loadedFontFace);
        //           })
        //           .catch((error) => {
        //             fontsErrored.push(fontFace);
        //             // logMessages(['"react-to-print" was unable to load a font. "react-to-print" will continue attempting to print the page. The font that failed to load is:', fontFace, 'The error from loading the font is:', error]); // eslint-disable-line max-len
        //           });
        //       });
        //     } else {
        //       // logMessages(['"react-to-print" is not able to load custom fonts because the browser does not support the FontFace API']); // eslint-disable-line max-len
        //     }
        //   }

        //   const defaultPageStyle =
        //     typeof pageStyle === "function" ? pageStyle() : pageStyle;

        //   if (typeof defaultPageStyle !== "string") {
        //     // this.logMessages([`"react-to-print" expected a "string" from \`pageStyle\` but received "${typeof defaultPageStyle}". Styles from \`pageStyle\` will not be applied.`]); // eslint-disable-line max-len
        //   } else {
        //     const styleEl = domDoc.createElement("style");
        //     if (nonce) {
        //       styleEl.setAttribute("nonce", nonce);
        //       domDoc.head.setAttribute("nonce", nonce);
        //     }
        //     styleEl.appendChild(domDoc.createTextNode(defaultPageStyle));
        //     domDoc.head.appendChild(styleEl);
        //   }

        //   if (bodyClass) {
        //     domDoc.body.classList.add(...bodyClass.split(" "));
        //   }

        //   if (!isText) {
        //     // Copy canvases
        //     // NOTE: must use data from `contentNodes` here as the canvass elements in
        //     // `clonedContentNodes` will not have been redrawn properly yet
        //     const srcCanvasEls = isText
        //       ? []
        //       : contentNodes.querySelectorAll("canvas");
        //     const targetCanvasEls = domDoc.querySelectorAll("canvas");

        //     for (let i = 0; i < srcCanvasEls.length; ++i) {
        //       const sourceCanvas = srcCanvasEls[i];

        //       const targetCanvas = targetCanvasEls[i];
        //       const targetCanvasContext = targetCanvas.getContext("2d");

        //       if (targetCanvasContext) {
        //         targetCanvasContext.drawImage(sourceCanvas, 0, 0);
        //       }
        //     }

        //     // Pre-load images
        //     for (let i = 0; i < renderComponentImgNodes.length; i++) {
        //       const imgNode = renderComponentImgNodes[i];
        //       const imgSrc = imgNode.getAttribute("src");

        //       if (!imgSrc) {
        //         // this.logMessages(['"react-to-print" encountered an <img> tag with an empty "src" attribute. It will not attempt to pre-load it. The <img> is:', imgNode], 'warning'); // eslint-disable-line
        //         markLoaded(imgNode, false);
        //       } else {
        //         // https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
        //         const img = new Image();
        //         img.onload = markLoaded.bind(null, imgNode, true);
        //         img.onerror = markLoaded.bind(null, imgNode, false);
        //         img.src = imgSrc;
        //       }
        //     }

        //     // Pre-load videos
        //     for (let i = 0; i < renderComponentVideoNodes.length; i++) {
        //       const videoNode = renderComponentVideoNodes[i];
        //       videoNode.preload = "auto"; // Hint to the browser that it should load this resource

        //       const videoPoster = videoNode.getAttribute("poster");
        //       if (videoPoster) {
        //         // If the video has a poster, pre-load the poster image
        //         // https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
        //         const img = new Image();
        //         img.onload = markLoaded.bind(null, videoNode, true);
        //         img.onerror = markLoaded.bind(null, videoNode, false);
        //         img.src = videoPoster;
        //       } else {
        //         if (videoNode.readyState >= 2) {
        //           // Check if the video has already loaded a frame
        //           markLoaded(videoNode, true);
        //         } else {
        //           videoNode.onloadeddata = markLoaded.bind(null, videoNode, true);

        //           // TODO: if one if these is called is it possible for another to be called? If so we
        //           // need to add guards to ensure `markLoaded` is only called once for the node
        //           // TODO: why do `onabort` and `onstalled` seem to fire all the time even if
        //           // there is no issue?
        //           // videoNode.onabort = () => { console.log('Video with no poster abort'); markLoaded.bind(null, videoNode, false)(); }
        //           videoNode.onerror = markLoaded.bind(null, videoNode, false);
        //           // videoNode.onemptied = () => { console.log('Video with no poster emptied'); markLoaded.bind(null, videoNode, false)(); }
        //           videoNode.onstalled = markLoaded.bind(null, videoNode, false);
        //         }
        //       }
        //     }

        //     // Copy input values
        //     // This covers most input types, though some need additional work (further down)
        //     const inputSelector = "input";
        //     const originalInputs = contentNodes.querySelectorAll(inputSelector); // eslint-disable-line max-len
        //     const copiedInputs = domDoc.querySelectorAll(inputSelector);
        //     for (let i = 0; i < originalInputs.length; i++) {
        //       copiedInputs[i].value = originalInputs[i].value;
        //     }

        //     // Copy checkbox, radio checks
        //     const checkedSelector = "input[type=checkbox],input[type=radio]";
        //     const originalCRs = contentNodes.querySelectorAll(checkedSelector); // eslint-disable-line max-len
        //     const copiedCRs = domDoc.querySelectorAll(checkedSelector);
        //     for (let i = 0; i < originalCRs.length; i++) {
        //       copiedCRs[i].checked = originalCRs[i].checked;
        //     }

        //     // Copy select states
        //     const selectSelector = "select";
        //     const originalSelects = contentNodes.querySelectorAll(selectSelector); // eslint-disable-line max-len
        //     const copiedSelects = domDoc.querySelectorAll(selectSelector);
        //     for (let i = 0; i < originalSelects.length; i++) {
        //       copiedSelects[i].value = originalSelects[i].value;
        //     }
        //   }

        //   if (copyStyles) {
        //     const headEls = document.querySelectorAll(
        //       "style, link[rel='stylesheet']"
        //     );
        //     for (let i = 0, headElsLen = headEls.length; i < headElsLen; ++i) {
        //       const node = headEls[i];
        //       if (node.tagName.toLowerCase() === "style") {
        //         // <style> nodes
        //         const newHeadEl = domDoc.createElement(node.tagName);
        //         const sheet = node.sheet;
        //         if (sheet) {
        //           let styleCSS = "";
        //           // NOTE: for-of is not supported by IE
        //           try {
        //             // Accessing `sheet.cssRules` on cross-origin sheets can throw
        //             // security exceptions in some browsers, notably Firefox
        //             // https://github.com/gregnb/react-to-print/issues/429
        //             const cssLength = sheet.cssRules.length;
        //             for (let j = 0; j < cssLength; ++j) {
        //               if (typeof sheet.cssRules[j].cssText === "string") {
        //                 styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
        //               }
        //             }
        //           } catch (error) {
        //             // this.logMessages([`A stylesheet could not be accessed. This is likely due to the stylesheet having cross-origin imports, and many browsers block script access to cross-origin stylesheets. See https://github.com/gregnb/react-to-print/issues/429 for details. You may be able to load the sheet by both marking the stylesheet with the cross \`crossorigin\` attribute, and setting the \`Access-Control-Allow-Origin\` header on the server serving the stylesheet. Alternatively, host the stylesheet on your domain to avoid this issue entirely.`, node], 'warning');
        //           }

        //           newHeadEl.setAttribute("id", `react-to-print-${i}`);
        //           if (nonce) {
        //             newHeadEl.setAttribute("nonce", nonce);
        //           }
        //           newHeadEl.appendChild(domDoc.createTextNode(styleCSS));
        //           domDoc.head.appendChild(newHeadEl);
        //         }
        //       } else {
        //         // <link> nodes, and any others
        //         // Many browsers will do all sorts of weird things if they encounter an
        //         // empty `href` tag (which is invalid HTML). Some will attempt to load
        //         // the current page. Some will attempt to load the page"s parent
        //         // directory. These problems can cause `react-to-print` to stop without
        //         // any error being thrown. To avoid such problems we simply do not
        //         // attempt to load these links.
        //         if (node.getAttribute("href")) {
        //           const newHeadEl = domDoc.createElement(node.tagName);

        //           // Manually re-create the node
        //           // TODO: document why cloning the node won't work? I don't recall
        //           // the reasoning behind why we do it this way
        //           // NOTE: node.attributes has NamedNodeMap type that is not an Array
        //           // and can be iterated only via direct [i] access
        //           for (
        //             let j = 0, attrLen = node.attributes.length;
        //             j < attrLen;
        //             ++j
        //           ) {
        //             // eslint-disable-line max-len
        //             const attr = node.attributes[j];
        //             if (attr) {
        //               newHeadEl.setAttribute(attr.nodeName, attr.nodeValue || "");
        //             }
        //           }

        //           newHeadEl.onload = markLoaded.bind(null, newHeadEl, true);
        //           newHeadEl.onerror = markLoaded.bind(null, newHeadEl, false);
        //           if (nonce) {
        //             newHeadEl.setAttribute("nonce", nonce);
        //           }
        //           domDoc.head.appendChild(newHeadEl);
        //         } else {
        //           // this.logMessages(['"react-to-print" encountered a <link> tag with an empty "href" attribute. In addition to being invalid HTML, this can cause problems in many browsers, and so the <link> was not loaded. The <link> is:', node], 'warning')
        //           // `true` because we"ve already shown a warning for this
        //           markLoaded(node, true);
        //         }
        //       }
        //     }
        //   }
      }

      if (linkTotal === 0 || !copyStyles) {
        triggerPrint(printWindow);
      }
    };

    // this.handleRemoveIframe(true);
    document.body.appendChild(printWindow);
    // triggerPrint(printWindow);
  };
  // const printPreview = () => {
  //   try {
  //     document.execCommand("print", false, null);
  //   } catch {
  //     window.print();
  //   }
  //   // var x = document.createElement("IFRAME");
  //   // x.setAttribute("id", "printf");
  //   // const y = document.getElementById("print");
  //   // y.parentNode.insertBefore(x, y);
  //   // var newWin = window.frames["printf"];
  //   // newWin.print();
  // };

  return (
    <div id="print">
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
