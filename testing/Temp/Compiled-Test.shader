
Shader "Example/Slices" {
	Properties {
		_MainTex ("Texture", 2D) = "white" {}
		_ClipRect ( "Clipping", Vector ) = ( 0, 0, 0, 0 )
	}

	SubShader {
		Cull Off
		Lighting Off      
	//	Blend SrcAlpha OneMinusSrcAlpha
		Tags {"RenderType"="Transparent" "Queue"="Transparent"}

		// surface shader with errors was here
Pass { }
/*// error compiling initial surface function 'surf':
#include "HLSLSupport.cginc"
#include "UnityShaderVariables.cginc"
#include "Lighting.cginc"
#include "UnityCG.cginc"
#include "Lighting.cginc"

#define INTERNAL_DATA
#define WorldReflectionVector(data,normal) data.worldRefl
#define WorldNormalVector(data,normal) normal
#line 1
#line 15

		#pragma surface surf Lambert

		struct Input {
			float2 uv_MainTex;
			float3 worldPos;
		};

		sampler2D _MainTex;
		float4 _ClipRect;

		void surf (Input IN, inout SurfaceOutput o) {
			if ( (IN.texcoord.x<_ClipRect.x) || (IN.texcoord.x>_ClipRect.y) || (IN.texcoord.y<_ClipRect.z) || (IN.texcoord.y>_ClipRect.w) ) {
				o.Albedo = half3 ( 0,0,0 );
			} else {
				o.Albedo = tex2D (_MainTex, IN.uv_MainTex).rgb;
			}
		}

		
*/
#LINE 33

	} 
 	
	Fallback "Diffuse"
}
