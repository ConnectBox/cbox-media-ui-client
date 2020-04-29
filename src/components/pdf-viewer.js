import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `pdf.worker.js`

const useStyles = makeStyles(theme => ({
  floatingButtonLeft: {
    margin: 0,
    color: 'lightgrey',
    backgroundColor: 'white',
    left: '15%',
    top: 'auto',
    right: 'auto',
    zIndex: 100,
    position: 'absolute',
  },
  rootDiv: {
    textAlign: 'center'
  },
  centered: {
    display: 'inline-block'
  },
  floatingButtonRight: {
    margin: 0,
    color: 'lightgrey',
    backgroundColor: 'white',
    left: '75%',
    top: 'auto',
    right: 'auto',
    zIndex: 100,
    position: 'absolute',
  },
}))


export const PDFViewer = ({url,onProgress,startPage}) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(startPage || 1)
  const fileObj = {}
  const maxPages = numPages < 8 ? numPages : 8
  const classes = useStyles()

  useEffect(() => {
    fileObj.url = url
  }, [url])

  const handlePrevious = (ev) => {
    if (numPages > 1) {
      onProgress(pageNumber-1)
      setPageNumber(pageNumber-1)
    }
  }
  const handleNext = (ev) => {
    if (pageNumber < numPages) {
      onProgress(pageNumber+1)
      setPageNumber(pageNumber+1)
    }
  }
  return (
    <div>
      <Document
        file={{url}}
        className={classes.rootDiv}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Fab
          size="small"
          className={classes.floatingButtonLeft}
          onClick={(ev) => handlePrevious(ev)}>
            <ChevronLeftIcon/>
        </Fab>
        <Fab
          size="small"
          className={classes.floatingButtonRight}
          onClick={(ev) => handleNext(ev)}>
            <ChevronRightIcon/>
        </Fab>
        <p className={classes.centered}>{pageNumber} / {numPages}</p>
        <Page
          key={`page_${pageNumber}`}
          pageNumber={pageNumber}
          renderAnnotationLayer
          renderInteractiveForms
        />
      </Document>
    </div>
  )
}
