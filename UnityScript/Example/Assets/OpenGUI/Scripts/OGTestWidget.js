#pragma strict

@script ExecuteInEditMode();

public class OGTestWidget extends MonoBehaviour {
	public var string : String = "";
	public var size : int = 12;
	public var font : Font;
	public var spacing : float = 1.25;
	public var lineHeight : float = 1.25;
	public var alignment : TextAnchor;
	public var shader : Shader;
	public var uv : Rect;
	public var border : OGSlicedSpriteOffset;
	public var atlas : Material;

	private var drawPosition : Vector3;
	private var drawScale : Vector3;

	function Update () {
		font.material.shader = shader;

		// Recalculate scale
		drawScale = transform.lossyScale;
			
		// Recalculate position
		drawPosition.x = transform.position.x;
		drawPosition.y = Screen.height - transform.position.y - drawScale.y;
		drawPosition.z = transform.position.z - 50;
	}

	function OnPostRender () {
		GL.PushMatrix();
		GL.LoadPixelMatrix ();
		
		GL.Begin(GL.QUADS);
		OGDrawHelper.SetPass ( atlas );
		OGDrawHelper.DrawSlicedSprite ( new Rect ( drawPosition.x, drawPosition.y, drawScale.x, drawScale.y ), uv, border, drawPosition.z );
		GL.End ();
		
		GL.Begin(GL.QUADS);
		font.material.SetPass(0);
		OGDrawHelper.DrawLabel ( new Rect ( drawPosition.x, drawPosition.y, drawScale.x, drawScale.y ), drawPosition.z, string, font, spacing, lineHeight, size, alignment );
		GL.End ();

		GL.PopMatrix();
	}
}
