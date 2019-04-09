import React, { useState } from 'react';
import { Button, Card, Container, Grid, Image, Segment, Sidebar, List } from 'semantic-ui-react'

const SIZES = ['S', 'M', 'L', 'XL'];

const Product = ({ product, cart }) => {
  const inStock = (size) => {
    return product.availableSizes[size] > cart.ordered(product, size);
  }
  const buttons = SIZES.filter(size => inStock(size)).map(size => {
    const buy = () => { cart.addItem(product, size); }
    return <Button circular size='mini' content={size} onClick={buy} />;
  });
  
  return (
    <Grid.Column>
    <Card>
      <Card.Content>
        <Card.Header style={{height:'4vem'}}>{ product.title }</Card.Header>
        <Image src={`/data/products/${product.sku}_1.jpg`} />
        <Card.Content extra>
          <Grid columns='1'>
            <Container>
              { product.style }
          </Container>
          <Card.Content extra>{buttons}</Card.Content>
          </Grid>
        </Card.Content>
      </Card.Content>
    </Card>
    </Grid.Column>
  );
}

const ProductList = ({ products, cart }) => {
  const items = Object.values(products).map(product => 
    <Product product={product} cart={cart} key={product.sku} />);
  return (
    <Grid container stackable padded stretched columns={4}>
        {items}
    </Grid>
  );
};

const setPath = (obj, keys, val) => (
  keys.length === 0 ? val : { 
    ...obj,
    [keys[0]]: setPath((obj[keys[0]] || {}), keys.slice(1), val)
  }
);

// cart object maps SKUs to objects with a product and another
// object that maps sizes to quantities ordered
const makeCart = () => {
  const [ cartOpen, setCartOpen ] = useState(false);
  const [ inCart, setInCart ] = useState({});
  return {
    isOpen() { return cartOpen; },
    items() { return Object.values(inCart); },
    toggleCart() { setCartOpen(!cartOpen); },
    openCart() { setCartOpen(true); },
    ordered(product, size) { 
      return (inCart[product.sku] && inCart[product.sku].ordered && inCart[product.sku].ordered[size]) || 0;
    },
    addItem(product, size) {
      setInCart(
        setPath(
          setPath(inCart, [product.sku, 'product'], product),
          [product.sku, 'ordered', size],
          this.ordered(product, size) + 1));
      this.openCart();
    }
  }; 
}

const CartItem = ({ item }) => {
  const sizeMap = item.ordered;
  const sizes = Object.keys(sizeMap).map(size => `${size}: ${sizeMap[size]}`).join(' ');
  const cost = Object.keys(sizeMap).reduce((cost, size) => cost + sizeMap[size] * item.product.price, 0);
  return <List.Item>{item.product.title} {sizes} ${cost}</List.Item>;
}

const Cart = ({ cart }) => {
  const items = cart.items().map(item => <CartItem item={item} />);
  return (
    <List>
      {items}
    </List>
  );
}

export default ({ products }) => {
  const cart = makeCart();
  
  return (
    <Container text>
      <Sidebar.Pushable as={Segment}>
        <Sidebar as={Segment} animation='overlay' icon='labeled'
                inverted direction='right' vertical 
                visible={cart.isOpen()}
        >
          <Cart cart={cart} />
          <Button onClick={cart.toggleCart}>Close</Button>
        </Sidebar>
        <Sidebar.Pusher>
          <ProductList products={products} cart={cart} />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Container>
  );
}
