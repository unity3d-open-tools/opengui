using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

[CustomEditor (typeof(OGSkin))]
[System.Serializable]
public class OGSkinInspector : Editor {
	private bool deleteMode = false;
	private bool addMode = false;
	private bool uvMode = false;
	private Vector2 uvScrollPosition;
	private float uvScale = 1;
	private string addStyleName = "";
	private Color tintColor = Color.white;

	private static int currentStyle = 0;
	private static bool setDefaultsMode = false;
	private static bool showText = false;
	
	public static void SetCurrentStyle ( int i ) {
		currentStyle = i;
		setDefaultsMode = false;
	}

	public static void SetDefaultsMode () {
		setDefaultsMode = true;
	}

	private string[] GetStyles ( bool includeCancel ) {
		OGSkin skin = (OGSkin) target;
		List< string > tempList = new List< string >();
		
		if ( includeCancel ) {
			tempList.Add ( "..." );
		}
		
		foreach ( OGStyle style in skin.styles ) {
			tempList.Add ( style.name );
		}
		
		return tempList.ToArray();
	}
	
	private void AddStyle ( string n ) {
		OGSkin skin = (OGSkin) target;
		
		for ( int i = 0; i < skin.styles.Length; i++ ) {
			if ( n == skin.styles[i].name ) {
				Debug.LogWarning ( "OpenGUI: There is already a style by name '" + n + "'" );
				return;
			}
		}
		
		List< OGStyle > tempList = new List< OGStyle > ( skin.styles );
		OGStyle newStyle = new OGStyle ();
		newStyle.name = n;

		tempList.Add ( newStyle );
		
		skin.styles = tempList.ToArray();
	
		SortStyles ( skin, newStyle );
	}
	
	private void RemoveStyle ( int i ) {
		OGSkin skin = (OGSkin) target;
		List< OGStyle > tempList = new List< OGStyle > ( skin.styles );
		
		tempList.RemoveAt ( i );
		
		skin.styles = tempList.ToArray();
	}
	
	private int CompareNames ( OGStyle a, OGStyle b ) {
		return a.name.CompareTo ( b.name );
	}
	
	private Vector3[] CalcBorderLines ( Rect controlRect, OGSkin skin ) {
		Vector3[] lines = new Vector3[8];
		float width = skin.styles[currentStyle].coordinates.width * 2;
		float height = skin.styles[currentStyle].coordinates.height * 2;
		
		// Left
		lines[0] = new Vector3 ( controlRect.x + skin.styles[currentStyle].border.left * width / skin.styles[currentStyle].coordinates.width, controlRect.y, 0 );
		lines[1] = lines[0] + new Vector3 ( 0, controlRect.height, 0 );
		
		// Right
		lines[2] = new Vector3 ( controlRect.x + width - skin.styles[currentStyle].border.right * width / skin.styles[currentStyle].coordinates.width, controlRect.y, 0 );
		lines[3] = lines[2] + new Vector3 ( 0, controlRect.height, 0 );
		
		// Top
		lines[4] = new Vector3 ( controlRect.x, controlRect.y + skin.styles[currentStyle].border.top * height / skin.styles[currentStyle].coordinates.height, 0 );
		lines[5] = lines[4] + new Vector3 ( controlRect.width, 0, 0 );
		
		// Bottom
		lines[6] = new Vector3 ( controlRect.x, controlRect.y + height - skin.styles[currentStyle].border.bottom * height / skin.styles[currentStyle].coordinates.height, 0 );
		lines[7] = lines[6] + new Vector3 ( controlRect.width, 0, 0 );
		
		return lines;
	}
	
	private Vector3[] CalcUVBorderLines ( Rect controlRect, OGStyle style, Texture atlas ) {
		Vector3[] lines = new Vector3[8];
		float width = style.coordinates.width * uvScale;
		float height = style.coordinates.height * uvScale;
		float x = controlRect.x + style.coordinates.x * uvScale;
		float y = controlRect.y + ( atlas.height - style.coordinates.y ) * uvScale;
		
		// Left
		lines[0] = new Vector3 ( x, y, 0 );
		lines[1] = lines[0] - new Vector3 ( 0, height, 0 );
		
		// Right
		lines[2] = new Vector3 ( x + width, y, 0 );
		lines[3] = lines[2] - new Vector3 ( 0, height, 0 );
		
		// Top
		lines[4] = new Vector3 ( x, y - height, 0 );
		lines[5] = lines[4] + new Vector3 ( width, 0, 0 );
		
		// Bottom
		lines[6] = new Vector3 ( x, y, 0 );
		lines[7] = lines[6] + new Vector3 ( width, 0, 0 );
		
		return lines;
	}

	private int GetStyleIndex ( OGSkin skin, OGStyle style ) {
		if ( skin != null && style != null ) {
			for ( int i = 0; i < skin.styles.Length; i++ ) {
				if ( skin.styles[i].name == style.name ) {
					return i;
				}
			}
		}
	
		return 0;
	}
	
	private int GuessStyleIndex ( OGSkin skin, OGWidgetType widgetType, OGStyleType styleType ) {
		int bestGuess = 0;
		
		if ( skin ) {
			for ( int i = 0; i < skin.styles.Length; i++ ) {
				if ( skin.styles[i].name == widgetType.ToString() && styleType == OGStyleType.Basic ) {
					bestGuess = i;
					break;

				} else if ( skin.styles[i].name.Contains ( widgetType.ToString() ) ) {
					bestGuess = i;
					
					if ( skin.styles[i].name.Contains ( styleType.ToString() ) ) {
						break;
					}
				}
			}
		}
	
		return bestGuess;
	}

	private string[] GetAnchors () {
		return System.Enum.GetNames(typeof(TextAnchor));
	}

	private string[] GetStyles ( OGSkin skin ) {
		List< string > tempList = new List< string >();
		
		if ( skin ) {
			foreach ( OGStyle style in skin.styles ) {
				tempList.Add ( style.name );
			}
		}
		
		return tempList.ToArray();
	}

	private string[] GetFonts ( OGSkin skin ) {
		List< string > tempList = new List< string >();
		
		if ( skin != null ) {
			foreach ( OGFont font in skin.fonts ) {
				if ( font != null ) {
					tempList.Add ( font.name );
				}
			}
		}
		
		return tempList.ToArray();
	}

	private void SortStyles ( OGSkin skin ) {
		List< OGStyle > tempList = new List< OGStyle > ( skin.styles );
				
		tempList.Sort ( CompareNames );
		
		skin.styles = tempList.ToArray ();
	}

	private void SortStyles ( OGSkin skin, OGStyle focus ) {
		SortStyles ( skin );

		for ( int i = 0; i < skin.styles.Length; i++ ) {
			if ( skin.styles[i] == focus ) {
				currentStyle = i;
			}
		}
	}

	private void SavePrefab () {
		GameObject selectedGameObject;
		PrefabType selectedPrefabType;
		GameObject parentGameObject;
		UnityEngine.Object prefabParent;
		     
	    	// Get currently selected object in "Hierarchy" view and store
	    	// its type, parent, and the parent's prefab origin
		selectedGameObject = Selection.gameObjects[0];
		selectedPrefabType = PrefabUtility.GetPrefabType(selectedGameObject);
		parentGameObject = selectedGameObject.transform.root.gameObject;
		prefabParent = PrefabUtility.GetPrefabParent(selectedGameObject);
		     
		// Notify the script this is modifying that something changed
		EditorUtility.SetDirty(target);
		     
		// If the selected object is an instance of a prefab
		if (selectedPrefabType == PrefabType.PrefabInstance) {
			// Replace parent's prefab origin with new parent as a prefab
			PrefabUtility.ReplacePrefab(parentGameObject, prefabParent,
			ReplacePrefabOptions.ConnectToPrefab);
	    	}
	}

	override public void OnInspectorGUI () {		
		serializedObject.Update ();
		
		OGSkin skin = (OGSkin) target;
				
		if ( skin == null ) { 
			EditorGUILayout.LabelField ( "Skin is null for some reason" );
			return;
		}
		
		if ( skin.styles == null ) {
			EditorGUILayout.LabelField ( "Skin styles are null for some reason" );
			return;
		}

		if ( currentStyle >= skin.styles.Length ) {
			currentStyle = skin.styles.Length - 1;
		}

		Object tempObj = null;
		OGStyle s = null;
		if ( skin.styles.Length > 0 ) {
			s = skin.styles[currentStyle];
		}
	
		// Set defaults	
		if ( setDefaultsMode ) {
			EditorGUILayout.BeginHorizontal ();

			EditorGUILayout.LabelField ( "Manage defaults", EditorStyles.boldLabel );

			// Reset
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "Reset", GUILayout.Width ( 50 ) ) ) {
				skin.ResetDefaults ();
			}
			
			EditorGUILayout.EndHorizontal ();
			
			EditorGUILayout.LabelField ( "Set the default widget styles" );
			
			GUILayout.Space ( 10 );
			
			// Back
			GUI.backgroundColor = Color.white;
			if ( GUILayout.Button ( "Back to inspector", GUILayout.Height ( 30 ) ) ) {
				setDefaultsMode = false;
			}

			// Auto detect
			bool autoDetect = false;
			if ( GUILayout.Button ( "Autodetect" ) ) {
				autoDetect = true;
			}

			GUILayout.Space ( 10 );

			foreach ( OGDefault d in skin.GetAllDefaults() ) {
				EditorGUILayout.LabelField ( d.widgetType.ToString(), EditorStyles.boldLabel, GUILayout.Width ( 100 ) );
				
				EditorGUILayout.BeginVertical ();

				foreach ( OGStyleType styleType in System.Enum.GetValues(typeof(OGStyleType)) as OGStyleType[] ) {
					if ( OGSkin.IsStyleUsed ( styleType, d.widgetType ) ) {
						string stateName = styleType.ToString();
						OGStyle style = d.styleSet.GetStyle ( styleType );
						int styleIndex;
					       
						if ( autoDetect ) {
							styleIndex = GuessStyleIndex ( skin, d.widgetType, styleType );		
						} else {
							styleIndex = GetStyleIndex ( skin, style );
						}

						EditorGUILayout.BeginHorizontal();
						EditorGUILayout.LabelField ( stateName, GUILayout.Width ( 80 ) );
						styleIndex = EditorGUILayout.Popup ( styleIndex, GetStyles ( skin ) );
						EditorGUILayout.EndHorizontal ();
						d.styleSet.SetStyle ( styleType, skin.styles [ styleIndex ] );
					}
				}

				EditorGUILayout.EndVertical ();

				GUILayout.Space ( 20 );
			}

			// Back
			GUI.backgroundColor = Color.white;
			if ( GUILayout.Button ( "Back to inspector", GUILayout.Height ( 30 ) ) ) {
				setDefaultsMode = false;
			}

		// Adjust UV
		} else if ( uvMode ) {
			EditorGUILayout.BeginHorizontal ();
			EditorGUILayout.LabelField ( "Style", EditorStyles.boldLabel, GUILayout.Width ( 50 ) );
			currentStyle = EditorGUILayout.Popup ( currentStyle, GetStyles ( false ), GUILayout.Width ( 100 ));
			EditorGUILayout.EndHorizontal ();
			
			EditorGUILayout.Space ();
			
			EditorGUILayout.LabelField ( "Edit widget UV coordinates" );
			
			EditorGUILayout.Space ();
		
			// Atlas
			Texture uvAtlasTex = skin.atlas.mainTexture;

			s.coordinates.x = Mathf.Floor ( s.coordinates.x );
			s.coordinates.y = Mathf.Floor ( s.coordinates.y );
			s.coordinates.width = Mathf.Floor ( s.coordinates.width );
			s.coordinates.height = Mathf.Floor ( s.coordinates.height );
			
			s.coordinates.x = Mathf.Clamp ( s.coordinates.x, 0, uvAtlasTex.width - s.coordinates.width );
			s.coordinates.y = Mathf.Clamp ( s.coordinates.y, 0, uvAtlasTex.height - s.coordinates.height );
			
			s.coordinates = EditorGUILayout.RectField ( s.coordinates );

			EditorGUILayout.Space ();

			uvScale = EditorGUILayout.Slider ( "Zoom", uvScale, 1, 10 );
			
			EditorGUILayout.Space ();
			
			uvScrollPosition = GUILayout.BeginScrollView ( uvScrollPosition, GUILayout.Height ( Mathf.Clamp ( uvAtlasTex.height * uvScale, uvAtlasTex.height, 300 ) + 20 ) );
			
			Rect uvControlRect = EditorGUILayout.GetControlRect ( false, uvAtlasTex.height * uvScale, GUILayout.Width ( uvAtlasTex.width * uvScale ) );
			Vector3[] uvBorderLines = CalcUVBorderLines ( uvControlRect, s, uvAtlasTex );

			GUI.DrawTexture ( uvControlRect, uvAtlasTex, ScaleMode.ScaleToFit, true );
		
			Handles.color = Color.green;

			Handles.DrawLine ( uvBorderLines[0], uvBorderLines[1] );
			Handles.DrawLine ( uvBorderLines[2], uvBorderLines[3] );
			Handles.DrawLine ( uvBorderLines[4], uvBorderLines[5] );
			Handles.DrawLine ( uvBorderLines[6], uvBorderLines[7] );
			
			Handles.color = Color.white;

			GUILayout.EndScrollView ();

			EditorGUILayout.Space ();

			// Back
			GUI.backgroundColor = Color.white;
			if ( GUILayout.Button ( "Back to inspector", GUILayout.Height ( 30 ) ) ) {
				uvMode = false;
			}

		// Edit style
		} else {	
			// Null check
			if ( skin.styles.Length > 0 ) {
				// Style
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "Style", EditorStyles.boldLabel, GUILayout.Width ( 50 ) );
				currentStyle = EditorGUILayout.Popup ( currentStyle, GetStyles ( false ), GUILayout.Width ( 100 ));
				
				EditorGUILayout.Space ();

				// ^ Preview
				if ( skin.atlas != null && skin.atlas.mainTexture != null ) {
					GUI.color = tintColor;
					
					Rect newCoords = new Rect (
						s.coordinates.x / skin.atlas.mainTexture.width,
						s.coordinates.y / skin.atlas.mainTexture.height,
						s.coordinates.width / skin.atlas.mainTexture.width,
						s.coordinates.height / skin.atlas.mainTexture.height
					);
					
					Rect controlRect = EditorGUILayout.GetControlRect ( false, s.coordinates.height * 2, GUILayout.Width(s.coordinates.width * 2));
					Vector3[] borderLines = CalcBorderLines ( controlRect, skin );
					Texture previewTex = skin.atlas.mainTexture;
					
					GUI.DrawTextureWithTexCoords ( controlRect, previewTex, newCoords, true );
							
					GUI.color = Color.white;

					Handles.DrawLine ( borderLines[0], borderLines[1] );
					Handles.DrawLine ( borderLines[2], borderLines[3] );
					Handles.DrawLine ( borderLines[4], borderLines[5] );
					Handles.DrawLine ( borderLines[6], borderLines[7] );
				}
				
				EditorGUILayout.EndHorizontal ();
				
				GUILayout.Space ( 20 );

				// ^ Name
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "Name", GUILayout.Width ( 100 ) );
				s.name = EditorGUILayout.TextField ( s.name );
				EditorGUILayout.EndHorizontal();

				// ^ Coordinates
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "Coordinates", GUILayout.Width ( 100 ) );
				s.coordinates = EditorGUILayout.RectField ( s.coordinates );
				if ( GUILayout.Button ( "Edit", GUILayout.Width ( 40 ), GUILayout.Height ( 30 ) ) ) {
					uvMode = true;
				}
				EditorGUILayout.EndHorizontal();

				// ^ Border
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "Border", GUILayout.Width ( 100 ) );

				EditorGUILayout.BeginVertical();
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.Space ();
				s.border.top = EditorGUILayout.FloatField ( s.border.top, GUILayout.Width ( 30 ) );
				EditorGUILayout.Space ();
				EditorGUILayout.EndHorizontal();
				EditorGUILayout.BeginHorizontal();
				s.border.left = EditorGUILayout.FloatField ( s.border.left, GUILayout.Width ( 30 ) );
				EditorGUILayout.Space ();
				s.border.right = EditorGUILayout.FloatField ( s.border.right, GUILayout.Width ( 30 ) );
				EditorGUILayout.EndHorizontal();
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.Space ();
				s.border.bottom = EditorGUILayout.FloatField ( s.border.bottom, GUILayout.Width ( 30 ) );
				EditorGUILayout.Space ();
				EditorGUILayout.EndHorizontal();
				EditorGUILayout.EndVertical();
				
				EditorGUILayout.EndHorizontal();
		
				// ^ Color
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.LabelField ( "Color", GUILayout.Width ( 100 ) );
				s.color = EditorGUILayout.ColorField ( s.color );

				tintColor = s.color;

				EditorGUILayout.EndHorizontal();

				// ^ Text
				EditorGUILayout.Space ();
					
				showText = EditorGUILayout.Foldout ( showText, "Text" );

				if ( s.text != null && showText ) {
					// ^^ Font
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField ( "Font", GUILayout.Width ( 100 ) );
					if ( s.text.fontIndex >= skin.fonts.Length ) {
						s.text.fontIndex = skin.fonts.Length - 1;
					
					} else if ( s.text.fontIndex < 0 ) {
						s.text.fontIndex = 0;
					
					}
					s.text.fontIndex = EditorGUILayout.Popup ( s.text.fontIndex, GetFonts ( skin ));
					s.text.font = skin.fonts[s.text.fontIndex];
					EditorGUILayout.EndHorizontal();
					
					// ^^ Size
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField ( "Size", GUILayout.Width ( 100 ) );
					s.text.fontSize = EditorGUILayout.IntField ( s.text.fontSize );
					EditorGUILayout.EndHorizontal();

					// ^^ Colour
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField ( "Color", GUILayout.Width ( 100 ) );
					s.text.fontColor = EditorGUILayout.ColorField ( s.text.fontColor );
					EditorGUILayout.EndHorizontal();
					
					// ^^ Alignment
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField ( "Alignment", GUILayout.Width ( 100 ) );
					s.text.alignment = (TextAnchor)EditorGUILayout.Popup ( (int)s.text.alignment, GetAnchors ());
					EditorGUILayout.EndHorizontal();
					
					// ^^ Word wrap
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField ( "Word wrap", GUILayout.Width ( 100 ) );
					s.text.wordWrap = EditorGUILayout.Toggle ( s.text.wordWrap );
					EditorGUILayout.EndHorizontal();
					
					// ^^ Padding
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField ( "Padding", GUILayout.Width ( 100 ) );

					EditorGUILayout.BeginVertical();
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.Space ();
					s.text.padding.top = (int)EditorGUILayout.FloatField ( s.text.padding.top, GUILayout.Width ( 30 ) );
					EditorGUILayout.Space ();
					EditorGUILayout.EndHorizontal();
					EditorGUILayout.BeginHorizontal();
					s.text.padding.left = (int)EditorGUILayout.FloatField ( s.text.padding.left, GUILayout.Width ( 30 ) );
					EditorGUILayout.Space ();
					s.text.padding.right = (int)EditorGUILayout.FloatField ( s.text.padding.right, GUILayout.Width ( 30 ) );
					EditorGUILayout.EndHorizontal();
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.Space ();
					s.text.padding.bottom = (int)EditorGUILayout.FloatField ( s.text.padding.bottom, GUILayout.Width ( 30 ) );
					EditorGUILayout.Space ();
					EditorGUILayout.EndHorizontal();
					EditorGUILayout.EndVertical();
					
					EditorGUILayout.EndHorizontal();

					// ^^ Line height
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField ( "Line height", GUILayout.Width ( 100 ) );
					s.text.lineHeight = EditorGUILayout.FloatField ( s.text.lineHeight );
					EditorGUILayout.EndHorizontal();
					
					// ^^ Spacing
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField ( "Spacing", GUILayout.Width ( 100 ) );
					s.text.spacing = EditorGUILayout.FloatField ( s.text.spacing );
					EditorGUILayout.EndHorizontal();
				}

				GUILayout.Space ( 20 );
			}

			// Fonts
			EditorGUILayout.LabelField ( "Fonts", EditorStyles.boldLabel );
			List< OGFont > tmpList;
			
			if ( skin.fonts.Length < 1 ) {
				skin.fonts = new OGFont[1];
			}
			
			for ( int i = 0; i < skin.fonts.Length; i++ ) {
				EditorGUILayout.BeginHorizontal();
			
				EditorGUILayout.LabelField ( i.ToString(), GUILayout.Width ( 30 ) );
			
				tempObj = (Object) skin.fonts[i];
				tempObj = EditorGUILayout.ObjectField ( tempObj, typeof(OGFont), false );
				skin.fonts[i] = (OGFont) tempObj;
			
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "x", GUILayout.Width ( 30 ), GUILayout.Height ( 14 ) ) ) {
					tmpList = new List< OGFont > ( skin.fonts );
					
					tmpList.RemoveAt ( i );
					
					skin.fonts = tmpList.ToArray ();
				}
				GUI.backgroundColor = Color.white;
			
				EditorGUILayout.EndHorizontal();
			}
			
			EditorGUILayout.BeginHorizontal();
			
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "+", GUILayout.Width ( 30 ), GUILayout.Height ( 14 ) ) ) {
				tmpList = new List< OGFont > ( skin.fonts );
				
				tmpList.Add ( null );
				
				skin.fonts = tmpList.ToArray ();
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.EndHorizontal();
		
			EditorGUILayout.Space();
			
			// Font shader
			EditorGUILayout.LabelField ( "Font shader", EditorStyles.boldLabel );
			tempObj = (Object) skin.fontShader;
			tempObj = EditorGUILayout.ObjectField ( tempObj, typeof(Shader), false );
			skin.fontShader = (Shader) tempObj;

			EditorGUILayout.Space();
		
			// Atlas
			EditorGUILayout.LabelField ( "Atlas", EditorStyles.boldLabel );
			tempObj = (Object) skin.atlas;
			tempObj = EditorGUILayout.ObjectField ( tempObj, typeof(Material), false );
			skin.atlas = (Material) tempObj;
		
			EditorGUILayout.Space();
		
			// Delete mode
			if ( deleteMode ) {
				EditorGUILayout.LabelField ( "Delete style", EditorStyles.boldLabel );
								
				EditorGUILayout.BeginHorizontal ();
				
				EditorGUILayout.LabelField ( "Are you sure?" );

				// Cancel
				if ( GUILayout.Button ( "Cancel" ) ) {
					deleteMode = false;
				}
				
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "Delete" ) ) {
					deleteMode = false;
					RemoveStyle ( currentStyle );
				}
				GUI.backgroundColor = Color.white;
				
				EditorGUILayout.EndHorizontal ();
			
			// Add mode
			} else if ( addMode ) {
				EditorGUILayout.LabelField ( "Add style", EditorStyles.boldLabel );
								
				EditorGUILayout.BeginHorizontal ();
				
				// Select
				addStyleName = EditorGUILayout.TextField ( addStyleName );
				
				// Cancel
				if ( GUILayout.Button ( "Cancel" ) ) {
					addMode = false;
				}
				
				GUI.backgroundColor = Color.green;
				if ( GUILayout.Button ( "Create" ) ) {
					addMode = false;
					AddStyle ( addStyleName );
				}
				GUI.backgroundColor = Color.white;
				
				EditorGUILayout.EndHorizontal ();
			
			// Else
			} else {
				EditorGUILayout.LabelField ( "Operations", EditorStyles.boldLabel );
								
				EditorGUILayout.BeginHorizontal ();
				
				// Add Style
				GUI.backgroundColor = Color.green;
				if ( GUILayout.Button ( "Add style" ) ) {
					addStyleName = "";
					addMode = true;
				}
				
				// Delete style
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "Delete style" ) ) {
					deleteMode = true;
				}
				
				EditorGUILayout.EndHorizontal ();
			
				// Manage defaults
				GUI.backgroundColor = Color.white;
				if ( GUILayout.Button ( "Sort styles" ) ) {
					SortStyles ( skin );
				} else if ( GUILayout.Button ( "Manage defaults", GUILayout.Height ( 30 ) ) ) {
					setDefaultsMode = true;
				}
				
			}
			
			EditorGUILayout.Space();
			
			if ( GUI.changed ) {
				SavePrefab (); 
			}
		}
	}
}
