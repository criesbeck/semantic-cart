import React, { useState } from 'react';
import { Button, Card, Container, Grid, Image, Segment, Sidebar, List } from 'semantic-ui-react'

const SIZES = ['S', 'M', 'L', 'XL'];

const Product = ({ inCart, addItem, product }) => {
  const inStock = (size) => {
    const want = inCart[product.sku] ? inCart[product.sku][size] : 0;
    return product.availableSizes[size] > want;
  }
  const buttons = SIZES.filter(size => inStock(size)).map(size => {
    const buy = () => { addItem(product, size); }
    return <Button circular onClick={buy}>{size}</Button>;
  });
  
  return (
    <Grid.Column>
    <Card>
      <Card.Content>
        <Card.Header>{ product.title }</Card.Header>
        <Image src={require(`./static/data/products/${product.sku}_1.jpg`)} />
        <Card.Content extra>
          <Grid columns='1'>
            <Container>
              { product.style }
          </Container>
          <Segment>{buttons}</Segment>
          </Grid>
        </Card.Content>
      </Card.Content>
    </Card>
    </Grid.Column>
  );
}

const ProductList = ({ inCart, addItem, products }) => {
  const items = Object.values(products).map(product => 
    <Product product={product} inCart={inCart} addItem={addItem} key={product.sku} />);
  return (
    <Grid container stackable stretched columns={4}>
        {items}
    </Grid>
  );
};

const Cart = ({ inCart }) => {
  const items = Object.values(inCart).map(item => <List.Item>{item.product.title}</List.Item>)
  return (
    <List>
      {items}
    </List>
  );
}

export default ({ products }) => {
  const [ cartOpen, setCartOpen ] = useState(false);
  const [ inCart, setInCart ] = useState({});
  const toggleCart = () => { setCartOpen(!cartOpen); };
  const openCart = () => { setCartOpen(true); };
  const addItem = (product, size) => {
    setInCart({
      ...inCart, 
      [product.sku]: {
        ...inCart[product.sku],
        product: product,
        [size]: inCart[product.sku][size] + 1
      }
    });
    openCart();
  }
  
  return (
    <Container text>
      <Sidebar.Pushable as={Segment}>
        <Sidebar as={Segment} animation='overlay' icon='labeled'
                inverted direction='right' vertical 
                visible={cartOpen}
        >
          <Cart inCart={inCart} />
          <Button onClick={toggleCart}>Close</Button>
        </Sidebar>
        <Sidebar.Pusher>
          <ProductList products={products} inCart={inCart} addItem={addItem} />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Container>
  );
}
