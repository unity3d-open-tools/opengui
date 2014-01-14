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
}
