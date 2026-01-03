# System Requirements — SoundFood Menu Intake

This document describes the functional requirements and user stories for the SoundFood Menu Intake Frontend application.

## Table of Contents

- [Overview](#overview)
- [User Roles](#user-roles)
- [User Stories](#user-stories)
  - [Authentication](#authentication)
  - [Profile Management](#profile-management)
  - [Menu Management](#menu-management)
  - [Dish Management](#dish-management)
  - [General](#general)
- [Functional Requirements](#functional-requirements)
  - [FR-AUTH: Authentication](#fr-auth-authentication)
  - [FR-PROFILE: Profile Management](#fr-profile-profile-management)
  - [FR-MENU: Menu Management](#fr-menu-menu-management)
  - [FR-DISH: Dish Management](#fr-dish-dish-management)
  - [FR-I18N: Internationalization](#fr-i18n-internationalization)
- [Non-Functional Requirements](#non-functional-requirements)
- [API Dependencies](#api-dependencies)

---

## Overview

The SoundFood Menu Intake Frontend is a web application that allows restaurant users to submit their menu data to the SoundFood platform. The collected data includes menu structure, dish details, and sensory attributes (tastes, colors, textures, shapes, emotions) that are used to generate tailored music experiences.

## User Roles

| Role | Description |
|------|-------------|
| **Restaurant User** | A registered user who can create, edit, and submit menus with dish information |
| **Guest** | An unauthenticated visitor who can only access the login/register pages |

---

## User Stories

### Authentication

| ID | User Story | Priority |
|----|------------|----------|
| US-AUTH-01 | As a guest, I can **register** a new account to access the menu intake form | High |
| US-AUTH-02 | As a guest, I can **log in** with my credentials to access my menus | High |
| US-AUTH-03 | As a restaurant user, I can **log out** to end my session | High |

### Profile Management

| ID | User Story | Priority |
|----|------------|----------|
| US-PROF-01 | As a restaurant user, I can **view my profile** with username and registration date | Medium |
| US-PROF-02 | As a restaurant user, I can **update my email address** from the profile page | Medium |
| US-PROF-03 | As a restaurant user, I can **change my password** by providing the current password and a new one | Medium |

### Menu Management

| ID | User Story | Priority |
|----|------------|----------|
| US-MENU-01 | As a restaurant user, I can **create a menu request** with a title and optional description | High |
| US-MENU-02 | As a restaurant user, I can **save a menu as draft** (only title required, no dishes needed) | High |
| US-MENU-03 | As a restaurant user, I can **submit** the menu request (title and at least one dish required), sending menu + dishes to the SoundFood API | High |
| US-MENU-04 | As a restaurant user, I can **see the list of my created menus** with their status (Draft/Submitted) and last modification time | High |
| US-MENU-05 | As a restaurant user, I can **open menu details** to view all information | Medium |
| US-MENU-06 | As a restaurant user, I can **edit a submitted menu** (menus remain editable after submission) | Medium |
| US-MENU-07 | As a restaurant user, I can **delete a menu** | Medium |

### Dish Management

| ID | User Story | Priority |
|----|------------|----------|
| US-DISH-01 | As a restaurant user, I can **add multiple dishes** to the menu | High |
| US-DISH-02 | As a restaurant user, I can **describe each dish** through section/category, taste intensity sliders, temperature/fat/piquant parameters, visual cues (up to 3 colors), and selectable textures/shapes/emotions loaded from the API | High |
| US-DISH-03 | As a restaurant user, I can **edit** existing dishes before or after submitting | Medium |
| US-DISH-04 | As a restaurant user, I can **delete** dishes from the menu | Medium |
| US-DISH-05 | As a restaurant user, I can **reorder dishes** via drag & drop to match the menu order | Low |

### General

| ID | User Story | Priority |
|----|------------|----------|
| US-GEN-01 | As a user, I can **switch language** (EN/IT) from the top bar | Medium |
| US-GEN-02 | As a user, I can **see a summary** of the submitted menu and dishes after submission | Low |

---

## Functional Requirements

### FR-AUTH: Authentication

| ID | Requirement | Related User Stories |
|----|-------------|---------------------|
| FR-AUTH-01 | The system shall allow users to register with username, email, and password | US-AUTH-01 |
| FR-AUTH-02 | The system shall allow users to log in with username and password | US-AUTH-02 |
| FR-AUTH-03 | The system shall persist authentication tokens in localStorage | US-AUTH-02 |
| FR-AUTH-04 | The system shall allow users to log out, clearing the stored token | US-AUTH-03 |
| FR-AUTH-05 | The system shall redirect unauthenticated users to the login page | US-AUTH-02 |

### FR-PROFILE: Profile Management

| ID | Requirement | Related User Stories |
|----|-------------|---------------------|
| FR-PROF-01 | The system shall display the user's username and registration date on the profile page | US-PROF-01 |
| FR-PROF-02 | The system shall allow users to update their email address | US-PROF-02 |
| FR-PROF-03 | The system shall allow users to change their password after verifying the current password | US-PROF-03 |

### FR-MENU: Menu Management

| ID | Requirement | Related User Stories |
|----|-------------|---------------------|
| FR-MENU-01 | The system shall allow users to create a new menu with title (required) and description (optional) | US-MENU-01 |
| FR-MENU-02 | The system shall allow saving menus as draft without dishes | US-MENU-02 |
| FR-MENU-03 | The system shall validate that a menu has at least one dish before submission | US-MENU-03 |
| FR-MENU-04 | The system shall display a list of user's menus with status badge (Draft/Submitted) | US-MENU-04 |
| FR-MENU-05 | The system shall display the last modification timestamp for each menu | US-MENU-04 |
| FR-MENU-06 | The system shall allow editing menu details (title, description) at any time | US-MENU-06 |
| FR-MENU-07 | The system shall allow deleting menus with confirmation | US-MENU-07 |
| FR-MENU-08 | The system shall show a "Just sent" badge for recently submitted menus | US-MENU-03 |

### FR-DISH: Dish Management

| ID | Requirement | Related User Stories |
|----|-------------|---------------------|
| FR-DISH-01 | The system shall allow adding dishes with name (required) and description (optional) | US-DISH-01 |
| FR-DISH-02 | The system shall provide section/category selection (appetizer, first course, etc.) | US-DISH-02 |
| FR-DISH-03 | The system shall provide taste intensity sliders (sweet, bitter, sour, salty, umami) | US-DISH-02 |
| FR-DISH-04 | The system shall provide additional parameter sliders (piquant, fat, temperature) | US-DISH-02 |
| FR-DISH-05 | The system shall allow selecting up to 3 colors per dish | US-DISH-02 |
| FR-DISH-06 | The system shall fetch and display available textures from the API | US-DISH-02 |
| FR-DISH-07 | The system shall fetch and display available shapes from the API | US-DISH-02 |
| FR-DISH-08 | The system shall fetch and display available emotions from the API | US-DISH-02 |
| FR-DISH-09 | The system shall allow editing existing dishes via a modal editor | US-DISH-03 |
| FR-DISH-10 | The system shall allow deleting dishes with confirmation | US-DISH-04 |
| FR-DISH-11 | The system shall support drag & drop reordering of dishes | US-DISH-05 |

### FR-I18N: Internationalization

| ID | Requirement | Related User Stories |
|----|-------------|---------------------|
| FR-I18N-01 | The system shall support English (EN) and Italian (IT) languages | US-GEN-01 |
| FR-I18N-02 | The system shall provide a language switcher in the navigation bar | US-GEN-01 |
| FR-I18N-03 | The system shall persist the user's language preference | US-GEN-01 |

---

## Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | The application shall load within 3 seconds on a standard connection |
| NFR-02 | Compatibility | The application shall work on modern browsers (Chrome, Firefox, Safari, Edge) |
| NFR-03 | Responsiveness | The application shall be usable on tablet and desktop devices |
| NFR-04 | Security | Authentication tokens shall be stored securely and transmitted over HTTPS |
| NFR-05 | Accessibility | The application shall follow WCAG 2.1 AA guidelines |
| NFR-06 | Testability | The application shall have unit test coverage for critical components |
| NFR-07 | Deployability | The application shall be deployable via Docker container |

---

## API Dependencies

The frontend requires a compatible SoundFood API with the following endpoints:

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate user and receive token |
| POST | `/auth/logout` | Invalidate current session |
| GET | `/auth/me` | Get current user profile |
| PATCH | `/auth/me/email` | Update user email |
| PATCH | `/auth/me/password` | Change user password |

### Menu Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menus` | List all menus for current user |
| POST | `/api/menus` | Create a new menu |
| GET | `/api/menus/:id` | Get menu details |
| PUT | `/api/menus/:id` | Update menu |
| DELETE | `/api/menus/:id` | Delete menu |
| POST | `/api/menus/:id/submit` | Submit menu for processing |

### Dish Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menus/:menuId/dishes` | List dishes for a menu |
| POST | `/api/menus/:menuId/dishes` | Add dish to menu |
| GET | `/api/dishes/:id` | Get dish details |
| PUT | `/api/dishes/:id` | Update dish |
| DELETE | `/api/dishes/:id` | Delete dish |

### Attribute Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/emotions` | List available emotions |
| GET | `/api/textures` | List available textures |
| GET | `/api/shapes` | List available shapes |
