(function () {
  var BUSINESS_EMAIL = "kumaradityasingh101@gmail.com";

  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = [
        "Name: " + d.get("name"),
        "Institution: " + (d.get("institution") || "-"),
        "Email: " + d.get("email"),
        "Need: " + d.get("service"),
        "",
        d.get("message") || ""
      ].join("\n");
      var subject = "Enquiry from " + d.get("name") + " - " + d.get("service");
      window.location.href = "mailto:" + BUSINESS_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      if (status) status.textContent = "Your email app should open with the message ready. If it does not, write to " + BUSINESS_EMAIL + ".";
    });
  }

  var hs=document.getElementById("heroSvg");
  if (hs) {
    var D={enrol:["Enrolment, last 6 months",[1176,1188,1201,1214,1231,1248],0],att:["Attendance rate, last 6 months (%)",[90.1,91.2,92,91.5,92.8,92.4],1],fee:["Fee collection rate, last 6 months (%)",[84.2,85,86.1,85.7,86.9,86.8],1]};
    var draw=function(k){
      var d=D[k],v=d[1],mn=Math.min.apply(0,v),mx=Math.max.apply(0,v),pad=(mx-mn)*0.2||1,lo=mn-pad,hi=mx+pad,
        pts=v.map(function(x,i){return [i*100+10,150-(x-lo)/(hi-lo)*130];}),p=pts.map(function(q){return q[0]+" "+q[1].toFixed(1);}).join(" L");
      hs.innerHTML='<defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#16b7ae" stop-opacity=".28"/><stop offset="1" stop-color="#16b7ae" stop-opacity="0"/></linearGradient></defs><path d="M'+p+' L510 170 L10 170Z" fill="url(#area)"/><path d="M'+p+'" fill="none" stroke="#16b7ae" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'+pts.map(function(q,i){return '<circle cx="'+q[0]+'" cy="'+q[1].toFixed(1)+'" r="5" fill="#16b7ae"><title>'+["Jan","Feb","Mar","Apr","May","Jun"][i]+": "+v[i].toLocaleString("en-IN")+'</title></circle>';}).join("");
      document.getElementById("heroTitle").textContent=d[0];
      var f=function(x){return d[2]?x.toFixed(1):Math.round(x).toLocaleString("en-IN");};
      document.getElementById("heroY").innerHTML=[hi,hi-(hi-lo)/3,hi-2*(hi-lo)/3,lo].map(function(x){return "<span>"+f(x)+"</span>";}).join("");
    };
    document.querySelectorAll(".metric").forEach(function(b){
      b.addEventListener("click",function(){
        document.querySelectorAll(".metric").forEach(function(x){var on=x===b;x.classList.toggle("on",on);x.setAttribute("aria-selected",on);});
        draw(b.dataset.m);
      });
    });
    draw("enrol");
  }
})();
