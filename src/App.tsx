import React, {useEffect, useState} from 'react'

import { fetchEmployees } from './api'
import { EmployeeTree, RawEmployee } from './types'

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Person from '@mui/icons-material/Person'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {CircularProgress, Paper, Typography, Box} from '@mui/material'

const App = () => {
  const [data, setData] = useState<EmployeeTree | unknown>({})
  const [fetchingData, setFetchingData] = useState(false)

  useEffect(() => {
    setFetchingData(true)
    fetchEmployees().then((data: RawEmployee[]) => {
      setData(nestData(data))
    }).catch(error => {
      console.error(error)
    }).finally(() => {
      setFetchingData(false)
    })
  }, [])

  const nestData = (data: RawEmployee[]) => {
    const normalizedData = data.map((e: RawEmployee) => ({
      ...e,
      manager_id: e?.manager_id || 0,
    }))
    const nest = (employees: RawEmployee[], id = 0): EmployeeTree[] => employees
      .filter(e => e.manager_id === id)
      .map(e => ({
        name: e.name,
        title: e.title,
        subordinates: nest(employees, e.id),
      }))
    return nest(normalizedData)
  }

  const ListNode = (employee: EmployeeTree, level = 0) => {
    const [open, setOpen] = useState(true)
    const hasSubordinates = employee?.subordinates.length > 0

    const Label = (employee: EmployeeTree) => (
      <Typography variant="h6">
        {
          <>
            <span>{`${employee.title}: `}</span>
            <span style={{fontWeight: 600}}>{`${employee.name}`}</span>
          </>
        }
      </Typography>
    )

    const listNodeStyle = (level: number) => ({
      backgroundColor: 'beige',
      width: 'fit-content',
      m: '1px',
      ml: level * 6,
      border: 'solid',
      borderWidth: 3,
      borderRadius: 2,
    })

    return (
      <>
        <ListItemButton
          onClick={() => {
            setOpen(!open)
          }}
          sx={listNodeStyle(level)}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary={Label(employee)} />
          {hasSubordinates && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List disablePadding>
              {employee.subordinates.map(e => ListNode(e, level + 1))}
            </List>
          </Collapse>
        }
      </>
    )
  }

  const MainList = () => {
    return (
      <List sx={{p: 5}}>
        {Object.values(data as EmployeeTree).map((e: any) => ListNode(e))}
      </List>
    )
  }

  return (
    <div className="App">
      <Paper
        elevation={10}
        sx={{width: 'content-fit', backgroundColor: 'aliceblue'}}>
          <Typography variant="h3" sx={{pl: 3, pt: 1}}>Org Chart</Typography>
          {fetchingData && (
            <Box>
              <CircularProgress size={100}/>
              <Typography variant="h6">
                Heroku probably put to sleep the back-end app since it's not been used in a while, 
                please give them a moment
              </Typography>
            </Box>
          )}
          <MainList></MainList>
      </Paper>
    </div>
  )
}

export default App
