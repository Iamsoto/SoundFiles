import React, { useEffect, useRef, useState } from 'react'

var parts = []
export default function Fuego({on, pk}){
  /*
    Beautiful fire, courtesy of: 
      https://codepen.io/jackrugile/pen/Jbnpv
  */
    const [c, setCanvasRef] = useState(null);
    const [cw, setWidth] = useState(null);
    const [ch, setHeight] = useState(null);
    const [ctx, setCtx] = useState(null)


    var partsFull = false;
    

    const rand = (min, max)=> {
        return Math.floor( (Math.random() * (max - min + 1) ) + min);
    };

    const hueRange= rand(15,35)
    const partCount = rand(160, 250);
    const handleCanvasRef = (r) => {
      if(c != r && r !== null){
        setCanvasRef(r);
      }
    }

    const createParts = () =>{
      if(!partsFull && on){
        if(parts.length > partCount){
          partsFull = true;
        } else {
          parts.push(new Part(ctx,cw,ch));
        }
      }else{

      }
    };
        
    const updateParts = ()=>{
      var i = parts.length;
      while(i--){
        if(parts[i].dead){
          parts.splice(i, 1)
        }else{
          parts[i].update();
        }
        
      }
    };

    const renderParts = ()=>{
      var i = parts.length;
      while(i--){
          parts[i].render();  
      }
    }

    const clear = () =>{
      if(!ctx){
        return
      }
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'hsla(0, 0%, 0%, .3)';
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'lighter';
    }
    
    function Part(){
      this.on=true;
      this.origin_x = cw/2
      this.origin_y = ch-40
      this.reset = ()=> {
        this.startRadius = rand(1, 25);
        this.radius = this.startRadius;
        this.x = this.origin_x + (rand(-30, 30));
        this.y = this.origin_y + (rand(-10, 10));  
        this.vx = 0;
        this.vy = 0;
        this.hue = hueRange;
        this.saturation = rand(50, 100);
        this.lightness = rand(20, 70);
        this.startAlpha = rand(1, 10) / 200;
        this.alpha = this.startAlpha;
        this.decayRate = .1;  
        this.startLife = 7;
        this.life = this.startLife;
        this.lineWidth = rand(1, 3);
        this.dead=false;
      }

      this.update = ()=>{
        this.vx += (rand(0, 200) - 100) / 1500;
        this.vy -= this.life/50;  
        this.x += this.vx;
        this.y += this.vy;  
        this.alpha = this.startAlpha * (this.life / this.startLife);
        this.radius = this.startRadius * (this.life / this.startLife);
        this.life -= this.decayRate;
        if(
          this.x > cw + this.radius || 
          this.x < -this.radius ||
          this.y > ch + this.radius ||
          this.y < -this.radius ||
          this.life <= this.decayRate
        ){
          if(!this.on){
            this.dead = true;
          }else{
            this.reset()
          }
          
        }else{

        }
      }

      this.render = ()=>{

        //console.log(this.origin_x)
        
        var r = Math.sqrt( Math.pow(this.x-this.origin_x, 2) + Math.pow(this.y - this.origin_y, 2))
        //console.log(r)
        if(false){
          ctx.fillStyle = ctx.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, 0.05)';
        }else{
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);          
          ctx.fillStyle = ctx.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, '+this.alpha+')';
        }
        
        ctx.lineWidth = this.lineWidth;
        ctx.fill();
        ctx.stroke();
      }
      this.reset()
    }

    const setSize = () => {
      setWidth(window.innerWidth - 20)
      setHeight(window.innerHeight/3)
      if(parts.length > 0){
        parts = []
      }
    }

    useEffect(()=>{
      /**
        Hook for size
      */
      setSize()
      window.addEventListener('resize', setSize);

    },[window.innerWidth])

    
    useEffect(()=>{
      /**
        Hook for when canvas != null
      */
      if(c == null){
        return;
      }
      setCtx(c.getContext('2d'))

      return ()=> window.removeEventListener('resize', setSize)
    },[c])


    useEffect(()=>{
      /**
        Hook to play fire effect
      */
      var cur_width = 0;
      parts.forEach((part)=>{
        part.on = false;
      })

      const play = setInterval(()=>{
        if(ctx){
          clear();
          createParts();
          updateParts();
          renderParts();
        } 
      },1000/30)
    
    if(!on){
      parts.forEach((part)=>{
        part.on = false;
      })

      if(parts.length <= 0){
        clearInterval(play)
      }
    }else if(false){
      /**
        resize
      */

    }
    //cur_width = cw
    return () => clearInterval(play)

    },[on, ctx])

  
  return(
      <canvas ref={handleCanvasRef} id={`canvas-episode-play-id-${pk}`} width={cw} height={ch}></canvas>
    )
}

