"use strict";(self.webpackJsonpCheckout=self.webpackJsonpCheckout||[]).push([[356],{53580:(e,t,n)=>{n.r(t),n.d(t,{default:()=>O});var a=n(86940),r=n(696),i=n.n(r),o=n(67627),s=n(91074),l=n(59728),c=n(70140),m=n(34927),u=n(70218),d=n(77068);function p(e){var t=e.physicalItems,n=e.digitalItems,a=e.giftCertificates,r=e.customItems;return t.length+n.length+a.length+(r||[]).length}var h=n(67106),C=n(46004),f=n(19984),y=n(9607),E=n(65228),g=n(48527),k=n(75524),I=n(50041),v=function(e){var t=e.onRequestClose,n=e.headerLink;return o.createElement(o.Fragment,null,o.createElement("a",{className:"cart-modal-close",href:"#",onClick:(0,h.Z)(t)},o.createElement("span",{className:"is-srOnly"},o.createElement(c.Z,{id:"common.close_action"})),o.createElement(C.Z,null)),o.createElement(y.Z,{additionalClassName:"cart-modal-title"},o.createElement(c.Z,{id:"cart.cart_heading"})),n)};const Z=function(e){var t=e.additionalLineItems,n=(e.children,e.onRequestClose),r=e.onAfterOpen,i=e.storeCurrency,s=e.shopperCurrency,l=e.isOpen,c=e.headerLink,m=e.lineItems,u=e.total,d=(0,a._T)(e,["additionalLineItems","children","onRequestClose","onAfterOpen","storeCurrency","shopperCurrency","isOpen","headerLink","lineItems","total"]);return o.createElement(f.Z,{additionalBodyClassName:"cart-modal-body optimizedCheckout-orderSummary",additionalHeaderClassName:"cart-modal-header optimizedCheckout-orderSummary",header:v({headerLink:c,onRequestClose:n}),isOpen:l,onAfterOpen:r,onRequestClose:n},o.createElement(g.Z,null,o.createElement(E.Z,{items:m})),o.createElement(g.Z,null,o.createElement(k.Z,(0,a.pi)({},d,{lineitems:m})),t),o.createElement(g.Z,null,o.createElement(I.Z,{orderAmount:u,shopperCurrencyCode:s.code,storeCurrencyCode:i.code})))};const O=(0,o.memo)((function(e){var t=e.additionalLineItems,n=e.coupons,r=e.discountAmount,h=e.giftCertificates,C=e.handlingAmount,f=e.headerLink,y=e.lineItems,E=e.onRemovedCoupon,g=e.onRemovedGiftCertificate,k=e.shippingAmount,I=e.shopperCurrency,v=e.storeCreditAmount,O=e.giftWrappingAmount,A=e.storeCurrency,D=e.subtotalAmount,N=e.taxes,w=e.total,q=(0,o.useCallback)((function(e){return o.createElement(Z,(0,a.pi)({},e,{additionalLineItems:t,coupons:n,discountAmount:r,giftCertificates:h,giftWrappingAmount:O,handlingAmount:C,headerLink:f,lineItems:y,onRemovedCoupon:E,onRemovedGiftCertificate:g,shippingAmount:k,shopperCurrency:I,storeCreditAmount:v,storeCurrency:A,subtotalAmount:D,taxes:N,total:w}))}),[t,n,r,h,C,f,y,E,g,O,k,I,v,A,D,N,w]),L=(0,s.findIndex)(y.physicalItems,{sku:"COD1"}),R=(0,s.findIndex)(y.physicalItems,{sku:"COD2"}),b=(0,s.findIndex)(y.physicalItems,{sku:"COD3"}),x=(0,s.findIndex)(y.physicalItems,{sku:"COD4"});return o.createElement(u.Z,{modal:q},(function(e){var t=e.onClick,n=e.onKeyPress;return o.createElement("div",{className:"cartDrawer optimizedCheckout-orderSummary",onClick:t,onKeyPress:n,tabIndex:0},o.createElement("figure",{className:i()("cartDrawer-figure",{"cartDrawer-figure--stack":p(y)>1})},o.createElement("div",{className:"cartDrawer-imageWrapper"},function(e){var t=e.physicalItems[0]||e.digitalItems[0];if(t&&t.imageUrl)return o.createElement("img",{alt:t.name,"data-test":"cart-item-image",src:t.imageUrl});if(e.giftCertificates.length)return o.createElement(m.Z,null)}(y))),o.createElement("div",{className:"cartDrawer-body"},o.createElement("h3",{className:"cartDrawer-items optimizedCheckout-headingPrimary"},o.createElement(c.Z,{data:{count:L>-1?(0,d.Z)(y)-y.physicalItems[L].quantity:R>-1?(0,d.Z)(y)-y.physicalItems[R].quantity:b>-1?(0,d.Z)(y)-y.physicalItems[b].quantity:x>-1?(0,d.Z)(y)-y.physicalItems[x].quantity:(0,d.Z)(y)},id:"cart.item_count_text"})),o.createElement("a",null,o.createElement(c.Z,{id:"cart.show_details_action"}))),o.createElement("div",{className:"cartDrawer-actions"},o.createElement("h3",{className:"cartDrawer-total optimizedCheckout-headingPrimary"},o.createElement(l.Z,{amount:w}))))}))}))},70218:(e,t,n)=>{n.d(t,{Z:()=>i});var a=n(86940),r=n(67627);const i=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={isOpen:!1},t.canHandleEvent=!1,t.handleOpen=function(){t.canHandleEvent&&t.setState({isOpen:!0})},t.handleClose=function(){t.canHandleEvent&&t.setState({isOpen:!1})},t.handleKeyOpen=function(e){"Enter"===e.key&&t.handleOpen()},t}return(0,a.ZT)(t,e),t.prototype.componentDidMount=function(){this.canHandleEvent=!0},t.prototype.componentWillUnmount=function(){this.canHandleEvent=!1},t.prototype.render=function(){var e=this.props,t=e.children,n=e.modal,a=this.state.isOpen;return r.createElement(r.Fragment,null,t({onClick:this.handleOpen,onKeyPress:this.handleKeyOpen}),n({isOpen:a,onRequestClose:this.handleClose}))},t}(r.Component)}}]);
//# sourceMappingURL=order-summary-drawer-0c9c6c07.js.map