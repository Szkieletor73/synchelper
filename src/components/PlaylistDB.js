import Database from "tauri-plugin-sql-api"

export function loadVideos(dbPath) {
    return new Promise((resolve, reject) => {
        Database.load(`sqlite:${dbPath}`).then(
            (db) => {
                db.select(`
                SELECT p.md5, p.fullPath, p.createDate, v.width, v.height, v.duration, v.frameRate, v.codec, f.state, f.takeTime FROM playlists p INNER JOIN videos v USING(md5) LEFT JOIN flow_result f USING(md5)
                `).then(
                    (data) => {
                        db.close()
                        resolve(data)
                    },
                    (error) => {
                        db.close()
                        reject(error)
                    }
                )
            },
            (error) => {
                db.close()
                reject(error)
            }
    )
    })
}

export function savePlaylist(dbPath, videos) {
    return new Promise((resolve, reject) => {
        Database.load(`sqlite:${dbPath}`).then(
            (db) => {
                db.execute(`
                DELETE FROM playlists
                `).then(
                    () => {
                        let values = videos.map((video, index) => {
                            const createDate = Date.now() - (videos.length - index)
                            return `("${video.md5}", "${video.fullPath}", ${createDate})`
                        }).join(",")

                        db.execute(`
                        INSERT INTO playlists (md5, fullPath, createDate) VALUES ${values}
                        `).then(
                            (data) => {
                                db.close()
                                resolve(data)
                            },
                            (error) => {
                                db.close()
                                reject(error)
                            }
                        )
                    },
                    (error) => {
                        db.close()
                        reject(error)
                    }
                )
            },
            (error) => {
                db.close()
                reject(error)
            }
    )
    })
}