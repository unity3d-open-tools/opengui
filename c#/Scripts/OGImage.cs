using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/Image")]
public class OGImage : OGWidget {

	public enum XorY {
		X,
		Y
	}
	
	public Texture2D image;
	public ScaleMode scale;
	public bool  alphaBlend = true;
	public Vector2 repeatTexture;
	public XorY maintainRatio;
	
	public bool  mouseClick = false;
	public GameObject target;
	public string message;
	public string argument;
	
	private bool  isclicked;
	
	public override void UpdateWidget (){
		if ( image ) {
			if ( image.wrapMode != TextureWrapMode.Repeat ) {
				image.wrapMode = TextureWrapMode.Repeat;
			}
		}
	}
	
	public override void Draw (  float x ,   float y   ){
		if ( image ) {
			Rect rect = new Rect( x, y, transform.localScale.x, transform.localScale.y );	
			if ( repeatTexture.x > 0 || repeatTexture.y > 0 ) {
				if ( maintainRatio == XorY.X ) {
					float ratioX = transform.localScale.y / transform.localScale.x;
					
					repeatTexture.y = repeatTexture.x * ratioX;
				} else if ( maintainRatio == XorY.Y ) {
					float ratioY = transform.localScale.x / transform.localScale.y;
					
					repeatTexture.x = repeatTexture.y * ratioY;
				}
				
				GUI.DrawTextureWithTexCoords ( rect, image, new Rect ( 0, 0, repeatTexture.x, repeatTexture.y ), alphaBlend );
			} else {
				GUI.DrawTexture ( rect, image, scale, alphaBlend, 0.0f );
			}
			if (mouseClick )
			{
				if (rect.Contains(Event.current.mousePosition))
				{
					if (Event.current.type == EventType.MouseDown)
					{
						isclicked = true;
					}
					if (Event.current.type == EventType.MouseDrag)
					{
						isclicked = false;
					}
					if (Event.current.type == EventType.MouseUp)
					{
						if (isclicked)
						{
							if ( !string.IsNullOrEmpty(argument) && target ) {
								target.SendMessage ( message, argument );
							} else if ( target ) {
								target.SendMessage ( message, this );
							}
						}
						isclicked = false;
					}
				}
				else
				{
					isclicked = false;
				}
			}
		}
	}
}
