import React, { useState } from 'react';
import { Button, Card, Container, Grid, Image, Segment, Sidebar } from 'semantic-ui-react'

const Product = ({ openCart, product }) => (
  <Grid.Column>
  <Card>
    <Card.Content onClick={openCart}>
      <Card.Header>{ product.title }</Card.Header>
      <Image src={require(`./static/data/products/${product.sku}_1.jpg`)} />
      <Card.Content extra>{ product.style }</Card.Content>
    </Card.Content>
  </Card>
  </Grid.Column>
);

const ProductList = ({ openCart, products }) => {
  const items = products.map(product => <Product product={product} openCart={openCart} key={product.sku} />);
  return (
    <Grid container stackable stretched columns={4}>
        {items}
    </Grid>
  );
};

export default ({ products }) => {
  const [ cartOpen, setCartOpen ] = useState(false);
  const toggleCart = () => { setCartOpen(!cartOpen); };
  const openCart = () => { setCartOpen(true); };

  return (
    <Container text>
      <Sidebar.Pushable as={Segment}>
        <Sidebar as={Segment} animation='overlay' icon='labeled'
                inverted direction='right' vertical width='thin'
                visible={cartOpen}
        >
          The cart is empty
          <Button onClick={toggleCart}>Close</Button>
        </Sidebar>
        <Sidebar.Pusher>
          <ProductList products={products} openCart={openCart}/>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Container>
  );
}
