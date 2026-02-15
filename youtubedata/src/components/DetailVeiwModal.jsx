import ModalPortal from './ModalPortal'

const DetailVeiwModal = ({ data, closemodal, detailmodal }) => {
    if (!data) return null;
    const formatDuration = (duration) => {
        return duration ? duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '') : 'N/A';
    };

    return (
        <>
            {detailmodal && (
                <ModalPortal>
                    <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
                     
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={closemodal}
                        />
                        
                        <div className="relative z-10001 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-modal-in">
                            
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-xl font-bold text-gray-800 truncate pr-8">
                                    {data.title}
                                </h3>
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 font-bold"
                                    onClick={closemodal}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                
                                <div className="relative flex items-center justify-center group mb-6 rounded-xl overflow-hidden shadow-lg cursor-pointer" 
                                     onClick={() => window.open(data.videoUrl, '_blank')}>
                                    <img 
                                        src={data.thumbnails?.maxres || data.thumbnails?.high} 
                                        alt="thumbnail" 
                                        className="w-1/2 h-auto object-cover"
                                    />
                                    {/* <div className="absolute inset-0 w-1/2 h-auto flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all"> */}
                                        <div className="bg-red-600 absolute top-1/2 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                                             Watch on YouTube
                                        </div>
                                    {/* </div> */}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                                    <div className="p-3 bg-blue-50 rounded-xl">
                                        <p className="text-xs text-blue-600 font-bold uppercase">Views</p>
                                        <p className="font-bold text-gray-800">{Number(data.viewCount).toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-xl">
                                        <p className="text-xs text-green-600 font-bold uppercase">Likes</p>
                                        <p className="font-bold text-gray-800">{Number(data.likeCount).toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-xl">
                                        <p className="text-xs text-orange-600 font-bold uppercase">Duration</p>
                                        <p className="font-bold text-gray-800">{formatDuration(data.duration)}</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-xl">
                                        <p className="text-xs text-purple-600 font-bold uppercase">Comments</p>
                                        <p className="font-bold text-gray-800">{data.commentCount}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 font-medium">Channel Name</span>
                                        <span className="text-gray-900 font-semibold">{data.channelTitle}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 font-medium">Title</span>
                                        <span className="text-gray-900 font-semibold">{data.title}</span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 font-medium">Description</span>
                                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                            {data.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 font-medium">Tags / Keywords</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {data.tags?.map((tag, idx) => (
                                                <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">
                                                    #{tag}
                                                </span>
                                            )) || "No tags available"}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                        <div>
                                            <span className="text-gray-500">Published At:</span>
                                            <p className="font-medium">{new Date(data.publishedAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Category:</span>
                                            <p className="font-medium text-blue-600">{data.categoryName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t bg-gray-50 flex gap-3">
                                <button 
                                    onClick={() => window.open(data.videoUrl, '_blank')}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-100 active:scale-95"
                                >
                                    Open in YouTube
                                </button>
                                <button 
                                    onClick={closemodal}
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </>
    )
}

export default DetailVeiwModal;