using System;
using UnityEngine;

[Serializable]
public class BasicPeerContent
{
    public PeerMessageType Type;

    public static BasicPeerContent Deserialize(string json)
    {
        BasicPeerContent basic = JsonUtility.FromJson<BasicPeerContent>(json);
        switch (basic.Type)
        {
            case PeerMessageType.ASSIGN:
                return JsonUtility.FromJson<AssignMessage>(json);
        }

        return basic;
    }

    public string Serialize()
    {
        return JsonUtility.ToJson(this);
    }
}
