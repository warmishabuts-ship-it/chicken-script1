(function () {
    "use strict";

    // Удаляем старую версию
    const old = document.getElementById("arena-bot");
    if (old) old.remove();

    const oldStyle = document.getElementById("arena-bot-style");
    if (oldStyle) oldStyle.remove();


    // Проверка страницы
    if (!location.href.includes("dozor.php?m=arena")) {
        alert("Открой страницу арены");
        return;
    }


    const settings = JSON.parse(
        localStorage.getItem("arena_bot_settings") || "{}"
    );


    const style = document.createElement("style");
    style.id = "arena-bot-style";

    style.textContent = `
    #arena-bot{
        position:fixed;
        top:${settings.y || 20}px;
        left:${settings.x || "auto"};
        right:${settings.x ? "auto" : "20px"};
        width:310px;
        background:linear-gradient(145deg,#1b1b28,#252538);
        color:white;
        border-radius:20px;
        z-index:999999;
        overflow:hidden;
        font-family:Inter,Arial,sans-serif;
        box-shadow:0 25px 80px rgba(0,0,0,.6);
        animation:show .25s ease;
    }

    @keyframes show{
        from{
            opacity:0;
            transform:scale(.9);
        }
        to{
            opacity:1;
            transform:scale(1);
        }
    }

    .arena-head{
        padding:16px 20px;
        display:flex;
        align-items:center;
        gap:10px;
        cursor:move;
        background:rgba(255,255,255,.05);
        border-bottom:1px solid rgba(255,255,255,.08);
    }

    .arena-logo{
        font-size:22px;
    }

    .arena-title{
        flex:1;
        font-weight:700;
    }

    .arena-version{
        font-size:11px;
        opacity:.4;
    }

    .arena-close{
        width:25px;
        height:25px;
        border:0;
        border-radius:50%;
        background:#ff453a;
        color:white;
        cursor:pointer;
    }


    .arena-body{
        padding:20px;
    }


    .label{
        font-size:11px;
        opacity:.5;
        text-transform:uppercase;
        margin-bottom:10px;
    }


    .grid{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:8px;
    }


    .pill{
        background:rgba(255,255,255,.05);
        border-radius:12px;
        padding:10px 5px;
        text-align:center;
        cursor:pointer;
        transition:.2s;
    }

    .pill:hover{
        transform:translateY(-2px);
        background:rgba(255,255,255,.1);
    }

    .pill.active{
        border:2px solid #6366f1;
    }


    .speed{
        margin-top:20px;
        padding:15px;
        background:rgba(255,255,255,.04);
        border-radius:15px;
    }


    input[type=range]{
        width:100%;
    }


    .speed-number{
        font-size:30px;
        font-weight:700;
        text-align:center;
    }


    .buttons{
        display:flex;
        gap:10px;
        margin-top:20px;
    }


    button.main{
        flex:1;
        padding:13px;
        border:0;
        border-radius:12px;
        cursor:pointer;
        color:white;
        font-weight:700;
    }


    .start{
        background:#34c759;
    }

    .stop{
        background:#ff3b30;
    }


    .counter{
        margin-top:20px;
        padding:20px;
        text-align:center;
        border-radius:15px;
        background:rgba(99,102,241,.2);
    }


    .counter b{
        font-size:35px;
    }
    `;

    document.head.appendChild(style);



    const panel=document.createElement("div");

    panel.id="arena-bot";


    panel.innerHTML=`

    <div class="arena-head">

        <div class="arena-logo">
        ⚡
        </div>

        <div class="arena-title">
        Arena Bot
        <div class="arena-version">
        v2.2
        </div>
        </div>

        <button class="arena-close">
        ×
        </button>

    </div>


    <div class="arena-body">


    <div class="label">
    Пилюлина
    </div>


    <div class="grid">

        <div class="pill" data-id="10">
        🧪<br>
        Мед
        </div>

        <div class="pill" data-id="218">
        🧪<br>
        Золотая
        </div>

        <div class="pill active" data-id="219">
        🧪<br>
        Боевая
        </div>

        <div class="pill" data-id="220">
        🧪<br>
        Хохотония
        </div>

    </div>


    <div class="speed">

        <div class="speed-number">
        <span id="speed">
        ${settings.speed || 1.5}
        </span>s
        </div>

        <input 
        id="range"
        type="range"
        min="0.5"
        max="5"
        step="0.5"
        value="${settings.speed || 1.5}"
        >

    </div>


    <div class="buttons">

        <button class="main start">
        ▶ Старт
        </button>

        <button class="main stop">
        ⏹ Стоп
        </button>

    </div>


    <div class="counter">

    <b id="count">
    ${settings.count || 0}
    </b>

    <br>

    действий

    </div>


    </div>
    `;


    document.body.appendChild(panel);



    let selected=settings.pill || 219;
    let running=false;
    let timer=null;
    let count=settings.count || 0;


    const save=()=>{

        const r=panel.getBoundingClientRect();

        localStorage.setItem(
            "arena_bot_settings",
            JSON.stringify({
                x:r.left,
                y:r.top,
                speed:Number(range.value),
                pill:selected,
                count:count
            })
        );

    };



    const range=panel.querySelector("#range");
    const speed=panel.querySelector("#speed");
    const countBox=panel.querySelector("#count");


    range.oninput=function(){

        speed.textContent=this.value;

        save();
    };



    panel.querySelectorAll(".pill")
    .forEach(p=>{

        p.onclick=function(){

            panel.querySelectorAll(".pill")
            .forEach(x=>x.classList.remove("active"));

            this.classList.add("active");

            selected=this.dataset.id;

            save();
        };

    });



    panel.querySelector(".start").onclick=function(){

        running=true;

        this.textContent="Работает";

        timer=setInterval(()=>{

            count++;

            countBox.textContent=count;

            save();

        },Number(range.value)*1000);

    };


    panel.querySelector(".stop").onclick=function(){

        running=false;

        clearInterval(timer);

        timer=null;

        countBox.textContent=count;

    };



    panel.querySelector(".arena-close")
    .onclick=function(){

        clearInterval(timer);

        save();

        panel.remove();

        style.remove();
    };



    // Перетаскивание

    const head=panel.querySelector(".arena-head");

    let drag=false;
    let sx,sy,px,py;


    head.onmousedown=e=>{

        drag=true;

        const r=panel.getBoundingClientRect();

        sx=e.clientX;
        sy=e.clientY;

        px=r.left;
        py=r.top;

        panel.style.left=px+"px";
        panel.style.right="auto";

    };


    document.onmousemove=e=>{

        if(!drag)return;

        panel.style.left=
        px+e.clientX-sx+"px";

        panel.style.top=
        py+e.clientY-sy+"px";

    };


    document.onmouseup=()=>{

        if(drag)
            save();

        drag=false;
    };


})();