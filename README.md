# 📖 Appointment Management - Project Guide

## 📌 Overview
This project is a **monorepo** using **Yarn workspaces**, designed for managing appointments. It includes multiple packages, such as:

- **`packages/appointment`** → Handles appointment creation and management.
- **`packages/appointment-store`** → Manages appointment storage and persistence.

The project leverages **AWS EventBridge and SQS** for event-driven communication.

---

## 🚀 Setup Instructions
### 1️⃣ Prerequisites
Before running the project, ensure you have the following installed:
- **Node.js** (`v14+`)
- **Yarn** (`v1.22+`)
- **AWS CLI** (configured with credentials)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/appointment-management.git
cd appointment-management
```

### 3️⃣ Install Dependencies
Run the following command at the root level to install dependencies for all packages:
```bash
yarn install
```

---

## 🏗 Build the Project
To build all packages, run:
```bash
yarn build
```
This will execute the `build` script in each workspace package.

---

## ☁ Deploying the Services
### **1️⃣ Deploy Appointment Service**
```bash
yarn deploy:appointment
```
This navigates to `packages/appointment` and runs its `deploy` script.

### **2️⃣ Deploy Appointment Store Service**
```bash
yarn deploy:appointment-store
```
This navigates to `packages/appointment-store` and runs its `deploy` script.

Each deployment uses **Serverless Framework** to deploy resources to AWS.

---

## 🎯 Usage
### **Trigger an Appointment Event**
Once deployed, you can trigger an appointment event by invoking the **sendAppointmentEvent** Lambda function.

Example using AWS CLI:
```bash
aws lambda invoke --function-name sendAppointmentEvent --payload '{}' response.json
```

### **Check EventBridge for Events**
```bash
aws events list-events --event-bus-name MyEventBus
```

### **Consume Events from SQS**
Events are stored in an **SQS queue** (`AppointmentQueue`) and processed by another Lambda (`processAppointment`).

You can check pending messages in SQS:
```bash
aws sqs receive-message --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/AppointmentQueue
```

---

## 🛠 Project Structure
```
appointment-management/
│── packages/
│   ├── appointment/          # Appointment service
│   ├── appointment-store/    # Appointment persistence service
│── serverless.yml            # AWS Infrastructure as Code
│── package.json              # Monorepo setup with Yarn workspaces
│── README.md                 # Project documentation
```

---

## 📌 Environment Variables
| Variable | Description |
|----------|------------|
| `EVENT_BUS_NAME` | The name of the EventBridge bus |
| `SQS_QUEUE_ARN` | The ARN of the SQS queue |
| `AWS_REGION` | The AWS region for deployment |

Set them in your `.env` file before running:
```bash
export EVENT_BUS_NAME=MyEventBus
export SQS_QUEUE_ARN=arn:aws:sqs:us-east-1:123456789012:AppointmentQueue
export AWS_REGION=us-east-1
```

---

## 🔗 References
- **AWS EventBridge:** [Docs](https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html)
- **AWS SQS:** [Docs](https://docs.aws.amazon.com/sqs/latest/dg/welcome.html)
- **Serverless Framework:** [Docs](https://www.serverless.com/framework/docs/)

---

## 🤝 Contributing
Feel free to open **issues** or **pull requests** to improve this project.

🚀 **Happy Coding!** 🎉

