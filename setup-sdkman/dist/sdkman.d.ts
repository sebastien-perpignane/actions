export declare const SDKMAN_DIR: string;
export declare class SdkMan {
    private installDir;
    constructor(installDir?: string);
    installSdkMan(): Promise<number>;
    private getBashSdkmanInstallationScript;
    private runSdkmanInstallScript;
    configureSdkManForAutoAnswer(): void;
    uninstall(candidate: string, version: string, force?: boolean): Promise<void>;
    installCandidateAndAddToPath(candidate: string, version: string): Promise<void>;
    private candidateDir;
    private candidateCurrentDir;
    private candidateVersionDir;
    isInstalled(): boolean;
    isCandidateInstalled(candidate: string): boolean;
    isCandidateVersionInstalled(candidate: string, version: string): boolean;
    private runCommand;
    candidatesDir(): string;
}
