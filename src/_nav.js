import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilClock,
  cilEnvelopeOpen,
  cilPeople,
  cilPowerStandby,
  cilSettings,
  cilSpeedometer,
  cilLink,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Customers',
    to: '/customers',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Generated Recipes',
    to: '/generated-recipe',
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
  },
    {
        component: CNavItem,
        name: 'API Configuration',
        to: '/api-configuration',
        icon: <CIcon icon={cilLink} customClassName="nav-icon" />,
      },
{
    component: CNavItem,
    name: 'Contact Us',
    to: '/contact',
    icon: <CIcon icon={cilEnvelopeOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Cuisine',
        to: '/cuisines',
      },
      {
        component: CNavItem,
        name: 'Meal Types',
        to: '/mealtype',
      },
      {
        component: CNavItem,
        name: 'Difficulty Levels',
        to: '/cookingdifficulty',
      },
      {
        component: CNavItem,
        name: 'Serving Count',
        to: '/servingcount',
      },
      {
        component: CNavItem,
        name: 'Preferred Ingredients',
        to: '/desiredproduct',
      },
      {
        component: CNavItem,
        name: 'Restricted Ingredients',
        to: '/unwantedproduct',
      },
      {
        component: CNavItem,
        name: 'Preparation Time',
        to: '/preparetime',
      },
 
    ],
  },

  
  {
    component: CNavItem,
    name: 'Logout',
    to: '/logout',
    icon: <CIcon icon={cilPowerStandby} customClassName="nav-icon" />,
  },
]

export default _nav
