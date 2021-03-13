using System;
using UnityEngine;

[Serializable]
public class CollectionMessage : BaseMessage
{
    public string Searilize()
    {
        return JsonUtility.ToJson(this);
    }

    public string Stringify()
    {
        return string.Format("{0}#{1}", this.Type, this.Searilize());
    }
}
