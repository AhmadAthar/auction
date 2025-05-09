# Auction System

An auction system built with NestJS (backend), BullMQ for job queuing, and PostgreSQL.

## 🚀 Live Domain(Backend)
https://auction-46yg.onrender.com

---

## 🛠 Tech Stack
- **Backend**: NestJS, PostgreSQL, TypeORM, BullMQ
- **Queue System**: BullMQ + Redis
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: Render

---

## 📦 Running Locally

### Prerequisites
- Node.js
- Docker 
- PostgreSQL & Redis 

### Backend Setup

# Running locally without docker

- clone the repo
- navigate to root directory
- create dev.env file in the root directory with the given template
DB_TYPE=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_SYNCHRONIZE=
DB_LOGGING=
DB_SSL=
DB_ALE=
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
APP_PORT=
- RUN "yarn install" to install the required packages
- RUN "yarn start:dev" to start the app

# Running locally without docker

- clone the repo
- navigate to root directory
- create dev.env file in the root directory with the given template
DB_TYPE=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_SYNCHRONIZE=
DB_LOGGING=
DB_SSL=
DB_ALE=
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
APP_PORT=
- create docker image using command "docker build -t <image_name> ."
- run the docker container using the command "docker run -p 3000:3000 --name <container_name> <image_name>"






📋 **Development Approach**

🔑 **Key Decisions Made**

**Asynchronous Bid Handling with BullMQ**
To prevent race conditions and ensure atomicity, BullMQ queues bid creation jobs. This guarantees that simultaneous bids are processed sequentially in a controlled environment.

**Database Transactions for Consistency**
TypeORM transactions ensure all steps (item check, price comparison, saving bid, and updating highestBidId) are atomic. Failures rollback the transaction to maintain data integrity.

**Expiration Logic for Auctions**
Each item includes a duration. Bids are checked against the createdAt + duration timestamp to reject expired bids.



⚙️ **Robustness & Scalability**

**Decoupled Processing**
Offloading bid logic to background workers ensures responsiveness and scalability under load.

**Horizontal Scalability**
Redis-based BullMQ supports distributed processing by spawning multiple workers.

**Graceful Error Handling**
Structured try-catch blocks and meaningful exceptions deliver clear API responses.

**No Race Conditions**
Combining queueing and transactions avoids concurrency issues, ensuring accurate bid placement.







✅ **CI/CD Overview**
- CI (GitHub Actions): Automatically builds the Docker image on every push to the master branch.

- CD (Render): Automatically deploys the latest code from master using the Dockerfile.

- NOTE: env variaables are set in the render env variables




