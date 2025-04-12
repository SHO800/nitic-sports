const fetcher = async <T>(key: string): Promise<T> => {
    return await fetch(key).then((res) => res.json() as Promise<T>);
}

export default fetcher