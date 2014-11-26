using UnityEngine;
using System.Collections;

[System.Serializable]
public class OGCharacterInfo {
	public int index;
	public float width;
	public Rect uv;
	public Rect vert;
	public bool flipped;
	
	public bool carriageReturn {
		get {
			return index == '\n';
		}
	}
	
	public bool space {
		get {
			return index == ' ';
		}
	}
}

[System.Serializable]
public class OGFontInfo {
	public string name;
	public float kerning;
	public float lineSpacing;
	public float ascent;
	public int convertCase;
	public int characterPadding;
	public int characterSpacing;
	public OGCharacterInfo[] characterRects;
}

public class OGFont : MonoBehaviour {
	public Font bitmapFont;
	public Font dynamicFont;
	public int size = 72;
	public OGFontInfo info;
	public Vector2 atlasSize;

	public void UpdateData () {
		#if UNITY_EDITOR
		UnityEditor.SerializedObject s = new UnityEditor.SerializedObject ( bitmapFont );

		info.name = s.FindProperty ( "m_Name" ).stringValue;
		info.kerning = s.FindProperty ( "m_Kerning" ).floatValue;
		info.lineSpacing = s.FindProperty ( "m_LineSpacing" ).floatValue;
		info.ascent = s.FindProperty ( "m_Ascent" ).floatValue;
		info.characterPadding = s.FindProperty ( "m_CharacterPadding" ).intValue;
		info.characterSpacing = s.FindProperty ( "m_CharacterSpacing" ).intValue;
		info.convertCase = s.FindProperty ( "m_ConvertCase" ).intValue;

		int size = s.FindProperty ( "m_CharacterRects.Array.size" ).intValue;
		info.characterRects = new OGCharacterInfo[size];

		for ( int i = 0; i < size; i++ ) {
			OGCharacterInfo ci = new OGCharacterInfo ();
			
			ci.index = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].index" ).intValue; 
			ci.uv = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].uv" ).rectValue; 
			ci.vert = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].vert" ).rectValue; 
			ci.width = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].width" ).floatValue; 
			ci.flipped = s.FindProperty ( "m_CharacterRects.Array.data[" + i + "].flipped" ).boolValue;

			info.characterRects[i] = ci;
		}
		
		atlasSize = new Vector2 ( bitmapFont.material.mainTexture.width, bitmapFont.material.mainTexture.height );
		#endif
	}

	public OGCharacterInfo GetCharacterInfo ( int index ) {
		for ( int i = 0; i < info.characterRects.Length; i++ ) {
			if ( info.characterRects[i].index == index ) {
				return info.characterRects[i];
			}
		}

		return null;
	}
}
