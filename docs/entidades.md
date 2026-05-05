# API de Ingresso - Modelo Simplificado

## Entidades

### 1. User (já existente)

- id
- name
- email
- passwordHash
- cpf (opcional)
- role (USER \| ADMIN \| ORGANIZER)
- createdAt
- updatedAt

---

### 2. Event

- id
- title
- description
- startDate
- endDate
- status (DRAFT, PUBLISHED, CANCELLED)
- venue
- organizerId (User)
- createdAt
- updatedAt

---

### 3. TicketType

- id
- eventId
- name
- price
- quantityTotal
- quantitySold
- saleStart
- saleEnd
- isActive

---

### 4. Order

- id
- userId
- status (PENDING, PAID, CANCELLED)
- totalAmount
- createdAt
- updatedAt

---

### 5. Ticket

- id
- orderId
- eventId
- userId
- qrCode
- status (VALID, USED, CANCELLED)
- usedAt
- createdAt

---

## Fluxo

User → Order → Ticket → Event + TicketType Event → TicketTypes
