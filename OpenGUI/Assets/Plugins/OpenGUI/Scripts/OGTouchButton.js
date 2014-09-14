#pragma strict
import System;

class OGTouchButton extends OGWidget 
{
    public var text : String = "";
    public var overrideFontSize : boolean = false;
    public var fontSize : int;
    public var overrideAlignment : boolean = false;
    public var alignment : TextAnchor;
    public var bDown : boolean = false;
    
    public var bShaded : boolean = true;
    public var shadowColor : Color;
    public var xOffset : int = 5;
    public var yOffset : int = 5;
    
    public var target : MonoBehaviour;
    public var onTouchCMD : String = "OnDown";
    public var onTouchReleaseCMD : String = "OnRelease";
    
    ////////////////////
    // Update
    ////////////////////
    override function UpdateWidget () {
        // Persistent vars
        isSelectable = true;
           
        if( bDown )
            currentStyle = styles.hover;
        else
            currentStyle = styles.basic;

        // Mouse
        mouseRct = drawRct;
    }
    
    ////////////////////
    // Interact
    ////////////////////
    function onTouch() {
        bDown = true;
        
        if( target != null && onTouchCMD != "" )
            target.Invoke( onTouchCMD, 0.0f);
    }
    
    function onTouchRelease() {
        bDown = false;
        
        if( target != null && onTouchReleaseCMD != "" )
            target.Invoke( onTouchReleaseCMD, 0.0f);
        
    }
    
    function checkTouched():boolean
    {
        for( var i:int = 0; i < Input.touches.length; i++ )
        {
            var touch:Touch = Input.GetTouch(i);
            var pos:Vector2 = new Vector2( touch.position.x * root.reverseRatio.x, touch.position.y * root.reverseRatio.y );
            if( drawRct.Contains( pos ) ) { return true; }
        }
        return false;
    }
    
    function Update():void
    {
        if( !bDown ) {
            if( checkTouched() )
                onTouch();
        }
        else
            if( !checkTouched() )
                onTouchRelease();
    }
    
    ////////////////////
    // Draw
    ////////////////////
    override function DrawSkin () {
        if ( currentStyle == null ) { return; }
        
        OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
    }
    
    override function DrawText () 
    {
        if( bShaded )
            OGDrawHelper.DrawLabel ( new Rect(drawRct.x + xOffset, drawRct.y - yOffset, drawRct.width, drawRct.height), text, styles.basic.text, fontSize, alignment, drawDepth, shadowColor, clipTo, null );
        OGDrawHelper.DrawLabel ( drawRct, text, styles.basic.text, fontSize, alignment, drawDepth, tint, clipTo, null );
    }
 
}
