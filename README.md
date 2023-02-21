# Ecommerce

Ecommerce backend based on the gRPC microservices ecosystem that includes: _authentication, shopping, ordering, promo usage, delivery, shipping tracking, etc_

> This is an overview of the project. Go to the submodule to see the implementation details of a specific service.

## Design features:

- Multilanguage: *Golang, TypeScript*
- *JWT* authentication
- *gRPC* based microservices
- *gRPC* based gateway

![Overview](./media/ecommerce-backend-overview.png)

### Authentication & authorization:

- [Authentication](https://github.com/numq/ecommerce-backend/authentication)
- [Token](https://github.com/numq/ecommerce-backend/token)
- [Account](https://github.com/numq/ecommerce-backend/account)
- [Confirmation](https://github.com/numq/ecommerce-backend/confirmation)

### Microservice infrastructure:

- [Gateway](https://github.com/numq/ecommerce-backend/gateway)

### Domain specific services:

##### User related:

- [Profile](https://github.com/numq/ecommerce-backend/profile)

##### Product related:

- [Category](https://github.com/numq/ecommerce-backend/category)
- [Catalog](https://github.com/numq/ecommerce-backend/catalog)
- [Search](https://github.com/numq/ecommerce-backend/search)
- [Promo](https://github.com/numq/ecommerce-backend/promo)

##### Purchase related:

- [Cart](https://github.com/numq/ecommerce-backend/cart)
- [Payment](https://github.com/numq/ecommerce-backend/payment)
- [Order](https://github.com/numq/ecommerce-backend/order)

##### Shipping related:

- [Delivery](https://github.com/numq/ecommerce-backend/delivery)
