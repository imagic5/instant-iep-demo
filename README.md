# InstantIEP Demo

Automated demonstration of the InstantIEP workflow using Puppeteer.

## Overview

This project demonstrates the complete workflow for generating an Individualized Education Program (IEP) using the InstantIEP application. The demonstration automates the interactions of four different user roles:

1. Case Manager (Ian Rosner - ELA Teacher)
2. Math Teacher (Albert Einstein)
3. Parent (Jonathan Kent)
4. Student (Clark Kent)

## Workflow

The demonstration follows this sequence:

1. Case Manager initiates the IEP process
2. Case Manager uploads assessment files
3. Case Manager completes ELA questionnaire
4. Math Teacher completes Math questionnaire
5. Parent completes Parent questionnaire
6. Student completes Student questionnaire
7. Case Manager views completed requirements
8. "Instant IEP" button appears when all requirements are met
9. Case Manager generates the IEP

## Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with your MongoDB connection string
4. Run `npm start` to start the demonstration

## Requirements

- Node.js 16 or higher
- MongoDB
- Internet connection