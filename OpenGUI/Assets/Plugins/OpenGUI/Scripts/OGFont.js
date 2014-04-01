#pragma strict

public class OGCharacterInfo {
	public var index : int;
	public var width : float;
	public var uv : Rect;
	public var vert : Rect;
	public var flipped : boolean;
	public var carriageReturn : boolean;
}

public class OGFontInfo {
	public var name : String;
	public var kerning : float;
	public var lineSpacing : float;
	public var ascent : float;
	public var convertCase : int;
	public var characterPadding : int;
	public var characterSpacing : int;
	public var size : int;
	public var characterRects : OGCharacterInfo[];
}

public class OGFont extends MonoBehaviour {
	public var bitmapFont : Font;
	public var dynamicFont : Font;
	public var info : OGFontInfo;
	public var atlasSize : Vector2;

	public function UpdateData () {
		#if UNITY_EDITOR
		var s : SerializedObject = new SerializedObject ( bitmapFont );

		info.name = s.FindProperty ( "m_Name" ).stringValue;
		info.kerning = s.FindProperty ( "m_Kerning" ).floatValue;
		info.lineSpacing = s.FindProperty ( "m_LineSpacing" ).floatValue;
		info.ascent = s.FindProperty ( "m_Ascent" ).floatValue;
		info.characterPadding = s.FindProperty ( "m_CharacterPadding" ).intValue;
		info.characterSpacing = s.FindProperty ( "m_CharacterSpacing" ).intValue;
		info.convertCase = s.FindProperty ( "m_ConvertCase" ).intValue;

		var size : int = s.FindProperty ( "m_CharacterRects.Array.size" ).intValue;
		info.characterRects = new OGCharacterInfo[size];

		for ( var i : int = 0; i < size; i++ ) {
			var ci : OGCharacterInfo = new OGCharacterInfo ();
			
			ci.index = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].index" ).intValue; 
			ci.uv = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].uv" ).rectValue; 
			ci.vert = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].vert" ).rectValue; 
			ci.width = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].width" ).floatValue; 
			ci.flipped = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].flipped" ).boolValue;

			if ( ci.index == "\n"[0] ) {
				ci.carriageReturn = true;
			}

			info.characterRects[i] = ci;
		}
		
		atlasSize = new Vector2 ( bitmapFont.material.mainTexture.width, bitmapFont.material.mainTexture.height );
		#endif
	}

	public function GetCharacterInfo ( index : int ) : OGCharacterInfo {
		for ( var i : int = 0; i < info.characterRects.Length; i++ ) {
			if ( info.characterRects[i].index == index ) {
				return info.characterRects[i];
			}
		}

		return null;
	}
}
