(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{22:function(t,e,a){t.exports=a.p+"static/media/gnpc_commodity_exports.97d62662.csv"},27:function(t,e,a){t.exports=a(37)},32:function(t,e,a){},33:function(t,e,a){t.exports=a.p+"static/media/logo.5d5d9eef.svg"},34:function(t,e,a){},35:function(t,e,a){},37:function(t,e,a){"use strict";a.r(e);var r=a(3),n=a.n(r),i=a(21),o=a.n(i),l=(a(32),a(26)),c=a(9),s=a(10),u=a(14),d=a(12),f=a(15),p=(a(33),a(34),a(13)),h=a.n(p),b=a(25),x=(a(16),a(17)),y=a(22),g=a.n(y),m=a(11),v=(a(35),a(2)),w=a(8),D=a(24),O=(a(38),a(6)),P=a(23),j=(a(1),function(t){function e(t){var a;return Object(c.a)(this,e),(a=Object(u.a)(this,Object(d.a)(e).call(this,t))).createChart=a.createChart.bind(Object(m.a)(a)),a}return Object(f.a)(e,t),Object(s.a)(e,[{key:"componentDidMount",value:function(){this.createChart()}},{key:"componentDidUpdate",value:function(){this.createChart()}},{key:"createChart",value:function(){var t=this.props.data?this.props.data:[],e=150,a=450,r=1e3-a-5,n=4e3-e-5,i=Object(v.a)(this.node);console.log(t);var o=Object(O.a)(",.2f"),l=Object(w.a)().range([n,0]),c={xOffset:0,yOffset:0,width:150,height:n,labelPositioning:{alpha:.5,spacing:18},leftTitle:"Lifting",rightTitle:"Buyer & Destination",leftSubTitle:"Date of Sale",rightSubTitle:"Payment Due Date",labelGroupOffset:5,labelKeyOffset:50,radius:6,subTitleYShift:20,unfocusOpacity:.3,revWidthMultiple:3.5,priceWidthMultiple:1.5},s=50,u=10,d="#ecb600",f="#CE1126",p="#eee",b=3,x=400,y="Volume (barrels)",g="Price (US$)",m="Revenue (US$)",j=Object(P.a)().attr("class","d3-tip").offset([0,20]).direction(function(t){return"se"}).html(function(t){return function(t,e){var a="<div class='tootltip' style='font-size:12px; border: 1px solid #ccc; background-color: rgba(255,255,255,0.9); padding:5px; max-width:350px; z-index:2000'>";return a+=t?"<div style='font-size:20px'>"+t+"</div>":"",e&&e.forEach(function(t){a+="<br/><strong>"+t.label+":</strong> ",a+="<div class='tootltip-value' style='font-size:18px;'>"+t.value+"</div>"}),a+="</div>"}(t.year,[{label:"Lifting",value:t.Lifting},{label:"Date of Sale",value:t.Date_of_sale.format("D MMM YYYY")},{label:"Payment Receipt Date",value:t.Payment_receipt_date.format("D MMM YYYY")},{label:"Price",value:"US$ "+o(t.Price)+" per barrel"},{label:"Volume",value:o(t.Volume)+" barrels"},{label:"Revenue",value:"US$ "+o(t.Revenue)},{label:"Buyer",value:t.Buyer},{label:"Destination",value:t.Destination}])});i.selectAll("g").remove();Object(w.a)().range([0,r]).domain([0,86400]),Object(w.b)(D.a).domain([0,10]);l.domain([new Date(2018,3,30),new Date(2015,0,1)]);var M=i.append("g").attr("class","border-lines").attr("transform","translate("+a+","+e+")");M.append("line").attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",c.height),M.append("line").attr("x1",c.width).attr("y1",0).attr("x2",c.width).attr("y2",c.height);var Y=i.append("g").selectAll("g").data(t).enter().append("g").attr("transform","translate("+a+","+e+")").attr("class","slope-group").attr("id",function(t,e){t.id="group"+t.Lifting,t.sellDate=t.Date_of_sale.toDate(),t.paymentDate=t.Payment_receipt_date.toDate()}),_=(Y.append("line").attr("class","slope-line").attr("x1",0).attr("y1",function(t){return console.log(t),l(t.sellDate)}).attr("x2",c.width).attr("y2",function(t){return l(t.paymentDate)}),Y.append("circle").attr("r",c.radius).attr("cy",function(t){return l(t.sellDate)}),Y.append("g").attr("class","slope-label-left").each(function(t){t.xLeftPosition=-c.labelGroupOffset,t.yLeftPosition=l(t.sellDate)}));_.append("text").attr("class","label-figure-small").attr("x",function(t){return t.xLeftPosition}).attr("y",function(t){return t.yLeftPosition}).attr("dx",-10).attr("dy",c.subTitleYShift).attr("text-anchor","end").text(function(t){return t.Date_of_sale.format("D MMM YYYY")}),_.append("text").attr("class","label-figure").attr("x",function(t){return t.xLeftPosition}).attr("y",function(t){return t.yLeftPosition}).attr("dx",-10).attr("dy",3).attr("text-anchor","end").text(function(t){return t.Lifting});Y.append("circle").attr("r",c.radius).attr("cx",c.width).attr("cy",function(t){return l(t.paymentDate)});var k=Y.append("g").attr("class","slope-label-right").each(function(t){t.xRightPosition=c.width+c.labelGroupOffset,t.yRightPosition=l(t.paymentDate)});k.append("text").attr("class","label-figure-small").attr("x",function(t){return t.xRightPosition}).attr("y",function(t){return t.yRightPosition}).attr("dx",10).attr("dy",c.subTitleYShift).attr("text-anchor","start").text(function(t){return t.Payment_receipt_date.format("D MMM YYYY")}),k.append("text").attr("class","label-figure").attr("x",function(t){return t.xRightPosition}).attr("y",function(t){return t.yRightPosition}).attr("dx",10).attr("dy",3).attr("text-anchor","start").text(function(t){return t.Buyer+", "+t.Destination});var S=i.append("g").attr("transform","translate(0,"+e+")").attr("class","title");S.append("text").attr("text-anchor","end").attr("x",a).attr("dx",-10).attr("dy",-e/4).text(c.leftTitle),S.append("text").attr("text-anchor","end").attr("class","label-figure-small").attr("x",a).attr("dx",-10).attr("dy",-e/4+c.subTitleYShift).text(c.leftSubTitle),S.append("text").attr("x",a+c.width).attr("dx",10).attr("dy",-e/4).text(c.rightTitle),S.append("text").attr("class","label-figure-small").attr("x",a+c.width).attr("dx",10).attr("dy",-e/4+c.subTitleYShift).text(c.rightSubTitle);var L=i.append("g").attr("transform","translate("+(a+c.width)+","+e+")").attr("class","price"),R=Object(w.a)().range([0,s]).domain([0,70]);function E(t){return t.Lifting.split(" ").join("").toLowerCase()}L.selectAll(".bar").data(t).enter().append("rect").attr("class",function(t){return"bar "+E(t)}).attr("x",function(t){return c.width*c.priceWidthMultiple}).attr("width",function(t){return R(+t.Price)}).attr("y",function(t,e){return t.yRightPosition-u/2}).attr("fill",function(t){return d}).attr("stroke",function(t){return p}).attr("height",function(t){return u}).on("mouseover",function(t){j.show(t,this),Object(v.b)("."+E(t)).attr("fill",f),Object(v.b)(".annote."+E(t)).attr("display","block")}).on("mouseout",function(t){j.hide(),Object(v.b)("."+E(t)).attr("fill",d),Object(v.b)(".annote."+E(t)).attr("display","none")}),S.append("text").attr("text-anchor","start").attr("x",a+c.width*(c.priceWidthMultiple+1)).attr("dx",-10).attr("dy",-e/4).text(g),S.append("text").attr("text-anchor","start").attr("x",0).attr("dx",0).attr("dy",-e/4).text(y),S.append("text").attr("text-anchor","start").attr("x",a+c.width*c.revWidthMultiple).attr("dx",0).attr("dy",-e/4).text(m);var T=t.map(function(t){return h.a.range(0,Math.round(t.Volume/1e4))});console.log(T);var C=[],W=[];t.forEach(function(t,r){C.push(i.append("g").attr("transform","translate(10,"+e+")").attr("class",function(t){return"volume"})),W.push(i.append("g").attr("transform","translate("+(a+c.width*c.revWidthMultiple)+","+e+")").attr("class",function(t){return"rev"})),C[r].selectAll(".bar").data(T[r]).enter().append("rect").attr("class",function(e){return"bar "+E(t)}).attr("x",function(t,e){return b*e}).attr("width",function(t){return b}).attr("y",function(e,a){return t.yLeftPosition-u/2}).attr("fill",function(t){return d}).attr("stroke",function(t){return p}).attr("height",function(t){return u}).on("mouseover",function(e){j.show(t,this),Object(v.b)("."+E(t)).attr("fill",f),Object(v.b)(".annote."+E(t)).attr("display","block")}).on("mouseout",function(e){j.hide(),Object(v.b)("."+E(t)).attr("fill",d),Object(v.b)(".annote."+E(t)).attr("display","none")}),W[r].selectAll(".bar").data(T[r]).enter().append("rect").attr("class",function(e){return"bar "+E(t)}).attr("x",function(e,a){var r=R(+t.Price);return a%Math.floor(x/r)*r}).attr("width",function(e){return R(+t.Price)}).attr("y",function(e,a){var r=R(+t.Price),n=Math.floor(x/r),i=Math.floor(a/n);return t.yRightPosition-u/2+u*i}).attr("fill",function(t){return d}).attr("stroke",function(t){return p}).attr("height",function(t){return u}).on("mouseover",function(e){j.show(t,this),Object(v.b)("."+E(t)).attr("fill",f),Object(v.b)(".annote."+E(t)).attr("display","block")}).on("mouseout",function(e){j.hide(),Object(v.b)("."+E(t)).attr("fill",d),Object(v.b)(".annote."+E(t)).attr("display","none")}),i.append("g").attr("transform","translate(0,"+e+")").append("text").attr("text-anchor","left").attr("class",function(e){return"annote "+E(t)}).attr("x",10).attr("dx",0).attr("y",t.yLeftPosition).attr("dy",-10).attr("fill",d).attr("display","none").text(o(t.Volume)+" barrels"),i.append("g").attr("transform","translate(0,"+e+")").append("text").attr("text-anchor","middle").attr("class",function(e){return"annote "+E(t)}).attr("x",a+c.width*(c.priceWidthMultiple+1.25)).attr("dx",0).attr("y",t.yRightPosition).attr("dy",-10).attr("fill",d).attr("display","none").text("US$ "+o(t.Price)+" per barrel"),i.append("g").attr("transform","translate(0,"+e+")").append("text").attr("text-anchor","left").attr("class",function(e){return"annote "+E(t)}).attr("x",a+c.width*(c.revWidthMultiple+.5)).attr("dx",0).attr("y",t.yRightPosition).attr("dy",-10).attr("fill",d).attr("display","none").text("US$ "+o(t.Revenue)+" in revenue")}),i.call(j)}},{key:"render",value:function(){var t=this,e=this.props.data?this.props.data:[];return n.a.createElement("div",{className:"MainVizComponent"},n.a.createElement("svg",{className:"MainChart",ref:function(e){return t.node=e},width:1500,height:200*e.length}))}}]),e}(r.Component));j.defaultProps={};var M=j,Y=function(t){function e(){var t,a;Object(c.a)(this,e);for(var r=arguments.length,n=new Array(r),i=0;i<r;i++)n[i]=arguments[i];return(a=Object(u.a)(this,(t=Object(d.a)(e)).call.apply(t,[this].concat(n)))).state=Object(l.a)({},a.props,{data:[]}),a}return Object(f.a)(e,t),Object(s.a)(e,[{key:"componentDidMount",value:function(){console.log("mounted"),this.getData()}},{key:"getData",value:function(){var t=this;(function(){var t=[];return t.push(Object(b.a)(g.a)),Promise.all(t).then(function(t){console.log(t);var e=[];return t[0].forEach(function(t){t.Date_of_sale=x(t.Date_of_sale,"YYYY-MM-DD"),t.Payment_receipt_date=x(t.Payment_receipt_date,"YYYY-MM-DD"),e.push(t)}),e})})().then(function(e){t.setState({data:e})})}},{key:"render",value:function(){return console.log(this.state.data),!!h.a.isEmpty(this.state.data)?null:n.a.createElement("div",{className:"App"},n.a.createElement("header",null),n.a.createElement("div",{className:"vizContainer"},n.a.createElement(M,{data:this.state.data})))}}]),e}(r.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(n.a.createElement(Y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[27,1,2]]]);
//# sourceMappingURL=main.9ad256ab.chunk.js.map