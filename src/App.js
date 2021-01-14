import React, { Component, Fragment } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({
   baseURL: 'https://sklep.idsl.pl/',
});

export default class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: true,
         data: null,
         editing: false,
         input_title: '',
         input_price: '',
         input_count: '',
         input_jm: '',
         input_type: '',
         post_title: '',
         post_price: '',
         post_count: '',
         post_jm: '',
         post_type: '',
      };

      this.getProducts();

      this.updateTitle = this.updateTitle.bind(this);
      this.updatePrice  = this.updatePrice.bind(this);
      this.updateCount = this.updateCount.bind(this);
      this.updateJm    = this.updateJm.bind(this);
      this.updateType  = this.updateType.bind(this);

      this.p_updateTitle = this.p_updateTitle.bind(this);
      this.p_updatePrice  = this.p_updatePrice.bind(this);
      this.p_updateCount = this.p_updateCount.bind(this);
      this.p_updateJm    = this.p_updateJm.bind(this);
      this.p_updateType  = this.p_updateType.bind(this);
   }
   
   async getProducts() {
      var data = await api.get('towar/').then(({ data }) => data);

      for (var product of Object.values(data)) {
         product["edit"] = false;
      };

      this.setState({ data: data, loading: false });
      console.log(data);
   }

   async deleteProduct(id) {
      await api.delete(`towar/${id}`);
      this.getProducts();
   }

   updateTitle(input) {
      this.setState({ input_title: input.target.value });
   }

   updatePrice(input) {
      this.setState({ input_price: input.target.value });
   }

   updateCount(input) {
      this.setState({ input_count: input.target.value });
   }

   updateJm(input) {
      this.setState({ input_jm: input.target.value });
   }

   updateType(input) {
      this.setState({ input_type: input.target.value });
   }

   async updateProduct(id) {
      var val = {
         nazwa: this.state.input_title,
         cena:  this.state.input_price,
         rodzaj:this.state.input_type,
         jm:    this.state.input_jm,
         ilosc: this.state.input_count,
      };

      await api.put(`towar/${id}`, val);
      this.getProducts();
   }

   p_updateTitle(input) {
      this.setState({ post_title: input.target.value });
   }

   p_updatePrice(input) {
      this.setState({ post_price: input.target.value });
   }

   p_updateCount(input) {
      this.setState({ post_count: input.target.value });
   }

   p_updateJm(input) {
      this.setState({ post_jm: input.target.value });
   }

   p_updateType(input) {
      this.setState({ post_type: input.target.value });
   }

   async postProduct() {
      var val = {
         nazwa: this.state.post_title,
         cena:  this.state.post_price,
         rodzaj:this.state.post_type,
         jm:    this.state.post_jm,
         ilosc: this.state.post_count,
      };

      await api.post('towar/', val);
      await this.getProducts();
   }

   render() {
      return (
         <Fragment>

            <a href="https://sklep.idsl.pl/copy.php"><button className="reset">⟳</button></a>

            <div className="product create">
               <h1 className="create-title">Stwórz nowy produkt</h1>
               <div className="blank-image create-component" />
               
               <input id="title" className="input-box create-input-box" placeholder="Nazwa" type="text" value={this.state.post_title} onChange={this.p_updateTitle} />

               <ul className="product-content create-content">
                  <li>Cena: <input id="price" className="s-input-box"  type="text" value={this.state.post_price} onChange={this.p_updatePrice} /></li>
                  <li>Ilość: <input id="count" className="ss-input-box" type="text" value={this.state.post_count} onChange={this.p_updateCount} />
                        <input id="jm" className="ss-input-box" type="text" value={this.state.post_jm}    onChange={this.p_updateJm}    /></li>
                  <li>Rodzaj: <input id="type"  className="s-input-box"  type="text" value={this.state.post_type}  onChange={this.p_updateType } /></li>
               </ul>
               
               <div className="buttons">
                  <button className="button delete" onClick={() => {this.setState({ post_title: '', post_price: '', post_count: '', post_jm: '', post_type: '' })}}>✘</button>
                  <button className="button edit"   onClick={() => {this.setState({ post_title: '', post_price: '', post_count: '', post_jm: '', post_type: '' }); this.postProduct()}}>✔</button>
               </div>
            </div>

            {!this.state.loading && this.state.data.map(product =>
               <div key={product.id} className="product">
                  <img src={`https://sklep.idsl.pl/upload/${product.id}.jpg`} alt={product.nazwa} className="product-image"/>
                  
                  {!product.edit ? <h1 className="product-title">{product.nazwa}</h1> : <input id="title" className="input-box" type="text" value={this.state.input_title} onChange={this.updateTitle} />}

                  <ul className="product-content">
                     <li>{!product.edit ? <Fragment>Cena: {product.cena} zł.           </Fragment> : <Fragment>Cena:   <input id="price" className="s-input-box"  type="text" value={this.state.input_price} onChange={this.updatePrice} /></Fragment>}</li>
                     <li>{!product.edit ? <Fragment>Ilość: {product.ilosc} {product.jm}</Fragment> : <Fragment>Ilość:  <input id="count" className="ss-input-box" type="text" value={this.state.input_count} onChange={this.updateCount} />
                                                                                                                       <input id="jm"    className="ss-input-box" type="text" value={this.state.input_jm}    onChange={this.updateJm   } /></Fragment>}</li>
                     <li>{!product.edit ? <Fragment>Rodzaj: {product.rodzaj}           </Fragment> : <Fragment>Rodzaj: <input id="type"  className="s-input-box"  type="text" value={this.state.input_type}  onChange={this.updateType } /></Fragment>}</li>
                  </ul>
                  
                  <div className="buttons">
                     {!product.edit ? <button className="button delete" onClick={() => this.deleteProduct(product.id)}>✘</button> 
                                    : <button className="button delete" onClick={() => {product.edit = !product.edit; this.setState({ editing: false, input_title: '', input_price: '', input_count: '', input_jm: '', input_type: '' })}}>✘</button>}
                     {!product.edit ? <button className="button edit"   onClick={() => {if (!this.state.editing) {product.edit = !product.edit; this.setState({ editing: true, input_title: product.nazwa, input_count: product.ilosc, input_jm: product.jm, input_price: product.cena, input_type: product.rodzaj })}}}>📝</button> 
                                    : <button className="button edit"   onClick={() => {product.edit = !product.edit; this.setState({ editing: false, input_title: product.nazwa, input_count: product.ilosc, input_jm: product.jm, input_price: product.cena, input_type: product.rodzaj }); this.updateProduct(product.id)}}>✔</button>}
                  </div>
               </div>
            )}
         <div className="props">
            Created by: <a href="https://github.com/Vani-lla">Igor Kowalczyk</a>
         </div>   
         </Fragment>
      )
   }
}