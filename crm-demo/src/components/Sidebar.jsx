import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Dashboard, Contacts, Assignment, BarChart } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Contact Management', icon: <Contacts />, path: '/contacts' },
    { text: 'Task Tracker', icon: <Assignment />, path: '/tasks' },
    { text: 'Reports', icon: <BarChart />, path: '/reports' },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: '#1a1a2e', // Sidebar background color
          color: '#fff', // Sidebar text color
          boxSizing: 'border-box',
        },
      }}
    >
      <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#162447' }}>
        <Typography variant="h6" component="div" style={{ color: '#fff', fontWeight: 'bold' }}>
          CRM System
        </Typography>
      </div>
      <List>
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#4CAF50' : '#fff', // Green for active, white for inactive
            })}
          >
            <ListItem
              button
              sx={{
                '&:hover': {
                  backgroundColor: '#0f3460', // Hover color
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit', // Icon inherits text color
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '16px',
                  fontWeight: 'medium',
                }}
              />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
