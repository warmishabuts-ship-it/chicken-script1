(function () {

    const OLD = document.getElementById("chicken-mac");
    if (OLD) OLD.remove();

    const OLD_STYLE = document.getElementById("chicken-mac-style");
    if (OLD_STYLE) OLD_STYLE.remove();


    let nick = localStorage.getItem("chicken_nick") || "";
    let timer = null;
    let running = false;


    const style = document.createElement("style");
    style.id = "chicken-mac-style";

    style.textContent = `
    #chicken-mac{
        position:fixed;
        top:50%;
        right:30px;
        transform:translateY(-50%);
        width:280px;
        background:rgba(40,40,40,.95);
        border-radius:16px;
        z-index:999999;
        font-family:Inter,Arial,sans-serif;
        color:white;
        overflow:hidden;
        box-shadow:0 25px 80px rgba(0,0,0,.5);
        backdrop-filter:blur(20px);
    }

    .mac-header{
        padding:16px 20px;
        display:flex;
        align-items:center;
        gap:12px;
        background:#333;
        cursor:move;
    }

    .mac-icon{
        width:32px;
        height:32px;
        border-radius:8px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#ff9f43;
    }

    .mac-title{
        flex:1;
    }

    .mac-title h3{
        margin:0;
        font-size:14px;
    }

    .mac-title p{
        margin:2px 0;
        font-size:11px;
        opacity:.5;
    }

    .mac-close{
        border:0;
        width:24px;
        height:24px;
        border-radius:50%;
        cursor:pointer;
        background:#555;
        color:white;
    }

    .mac-body{
        padding:20px;
    }

    .mac-input{
        width:100%;
        padding:14px;
        box-sizing:border-box;
        background:#000;
        color:#0f0;
        border-radius:10px;
        border:1px solid #555;
        text-align:center;
    }

    .mac-btn-row{
        display:flex;
        gap:10px;
        margin-top:15px;
    }

    .mac-btn{
        flex:1;
        padding:13px;
        border:0;
        border-radius:10px;
        color:white;
        cursor:pointer;
        font-weight:bold;
    }

    .start{
        background:#34c759;
    }

    .stop{
        background:#ff3b30;
    }

    .status{
        text-align:center;
        margin-top:15px;
        opacity:.6;
        font-size:12px;
    }
    `;

    document.head.appendChild(style);


    const panel = document.createElement("div");
    panel.id="chicken-mac";


    panel.innerHTML = `
    <div class="mac-header">
        <div class="mac-icon">🐔</div>

        <div class="mac-title">
            <h3>Отправить курицу</h3>
            <p>Автоматическая отправка</p>
        </div>

        <button class="mac-close">×</button>
    </div>

    <div class="mac-body">

        <input class="mac-input"
        placeholder="Ник игрока"
        value="${nick}">

        <div class="mac-btn-row">
            <button class="mac-btn start">
            Старт
            </button>

            <button class="mac-btn stop">
            Стоп
            </button>
        </div>


        <div class="status">
        Готово
        </div>

    </div>
    `;


    document.body.appendChild(panel);


    const input = panel.querySelector(".mac-input");
    const start = panel.querySelector(".start");
    const stop = panel.querySelector(".stop");
    const status = panel.querySelector(".status");
    const close = panel.querySelector(".mac-close");


    // восстановление позиции

    const pos = JSON.parse(localStorage.getItem("chicken_pos"));

    if(pos){
        panel.style.left=pos.x+"px";
        panel.style.top=pos.y+"px";
        panel.style.right="auto";
        panel.style.transform="none";
    }


    // отправка

    function sendChicken(){

        const enemy=document.getElementById("chicken_enemy");
        const form=document.querySelector(".confirm_box form");

        if(!enemy || !form)
            return;


        enemy.value=input.value;


        const btn=form.querySelector(
            "input[type=submit],button[type=submit]"
        );


        if(btn)
            btn.click();
        else
            form.submit();

    }



    start.onclick=function(){

        if(running)return;


        nick=input.value.trim();


        if(!nick){

            status.textContent="Введите ник";
            return;
        }


        localStorage.setItem(
            "chicken_nick",
            nick
        );


        sendChicken();


        timer=setInterval(
            sendChicken,
            300
        );


        running=true;

        status.textContent="Отправка...";
    };



    stop.onclick=function(){

        clearInterval(timer);

        timer=null;

        running=false;

        status.textContent="Остановлено";
    };



    close.onclick=function(){

        clearInterval(timer);

        panel.remove();

        style.remove();
    };



    // Drag

    const header=panel.querySelector(".mac-header");

    let drag=false;
    let sx,sy,px,py;


    header.onmousedown=function(e){

        if(e.target===close)
            return;


        drag=true;


        const r=panel.getBoundingClientRect();


        sx=e.clientX;
        sy=e.clientY;

        px=r.left;
        py=r.top;


        panel.style.left=px+"px";
        panel.style.top=py+"px";

        panel.style.right="auto";
        panel.style.transform="none";
    };


    document.onmousemove=function(e){

        if(!drag)return;


        const x=px+e.clientX-sx;
        const y=py+e.clientY-sy;


        panel.style.left=x+"px";
        panel.style.top=y+"px";


        localStorage.setItem(
            "chicken_pos",
            JSON.stringify({
                x:x,
                y:y
            })
        );
    };


    document.onmouseup=function(){
        drag=false;
    };


    input.focus();


})();