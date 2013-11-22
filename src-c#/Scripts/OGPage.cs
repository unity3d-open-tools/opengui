using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/Page")]
public class OGPage : MonoBehaviour {

	public string pageName = "";

	[HideInInspector] public OGRoot root;

	void Start (){
		if ( pageName == "" ) {
			pageName = name;
		}
	}

	public virtual void StartPage (){}

	public virtual void UpdatePage (){}
}